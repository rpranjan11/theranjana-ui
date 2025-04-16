// src/confer/client/shared/WebSocketContext.js
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import config from '../../config/wsConfig';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [connectionStatus, setConnectionStatus] = useState({
        status: 'disconnected',
        error: null
    });
    const [adminSession, setAdminSession] = useState(null);
    const [currentTopic, setCurrentTopic] = useState('');
    const [messages, setMessages] = useState([]);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const [shouldConnect, setShouldConnect] = useState(true);

    const handleWebSocketError = useCallback((error) => {
        console.error('WebSocket Error:', error);
        setConnectionStatus({
            status: 'error',
            error: 'Connection error occurred. Attempting to reconnect...'
        });
    }, []);

    const scheduleReconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
            connect();
        }, config.reconnect.initialDelay);
    }, []);

    const handleUnexpectedClosure = useCallback((event) => {
        console.warn('WebSocket closed unexpectedly:', event);
        setConnectionStatus({
            status: 'disconnected',
            error: 'Connection lost. Attempting to reconnect...'
        });
        scheduleReconnect();
    }, []);

    const startHeartbeat = useCallback(() => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
        }
        heartbeatIntervalRef.current = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'heartbeat' }));
            }
        }, config.heartbeat.interval);
    }, []);

    const handleAuthResponse = useCallback((message) => {
        if (message.status === 'success') {
            setAdminSession({
                adminId: message.adminId,
                lastActivity: Date.now()
            });
            setConnectionStatus({
                status: 'connected',
                error: null
            });
        } else if (message.status === 'existing_session') {
            setConnectionStatus({
                status: 'existing_session',
                sessionTransferAvailable: true
            });
        } else {
            setConnectionStatus({
                status: 'error',
                error: message.message || 'Authentication failed'
            });
        }
    }, []);

    const handleTimeoutWarning = useCallback((message) => {
        setConnectionStatus({
            status: 'timeout_warning',
            timeoutWarning: true,
            timeoutAt: Date.now() + message.timeoutIn
        });
    }, []);

    const handleMessage = useCallback((message) => {
        console.log('Message received:', {
            type: message.type,
            payload: message,
            currentTopic,
            adminSession
        });
        try {
            if (message.type !== 'heartbeat' && message.type !== 'heartbeat_ack') {
                console.log('WebSocket message received:', message.type, message);
            }

            switch (message.type) {
                case 'auth_response':
                    handleAuthResponse(message);
                    break;

                case 'admin_auth':
                    if (message.status === 'success') {
                        setAdminSession({
                            adminId: message.adminId,
                            lastActivity: Date.now()
                        });
                    }
                    break;

                case 'audience_connect':
                case 'initial_state':
                    if (message.adminId) {
                        setConnectionStatus({
                            status: 'connected',
                            error: null
                        });
                        if (message.messages) {
                            setMessages(message.messages);
                        }
                        if (message.currentTopic) {
                            setCurrentTopic(message.currentTopic);
                        }
                        setAdminSession({
                            adminId: message.adminId,
                            lastActivity: Date.now()
                        });
                    } else {
                        setConnectionStatus({
                            status: 'disconnected',
                            error: 'No active admin session'
                        });
                    }
                    break;

                case 'existing_session':
                    setConnectionStatus({
                        status: 'existing_session',
                        sessionTransferAvailable: true
                    });
                    break;

                case 'new_message':
                    console.log('New message received:', message.data);
                    setMessages(prev => {
                        // Check if message already exists in the array
                        const messageExists = prev.some(msg =>
                            msg.timestamp === message.data.timestamp &&
                            msg.content === message.data.content
                        );
                        if (messageExists) {
                            return prev;
                        }
                        return [...prev, message.data];
                    });
                    break;

                case 'push_message':
                    console.log('Push message received:', message.data);
                    if (message.data) {
                        const newMessage = {
                            ...message.data,
                            timestamp: message.data.timestamp || new Date().toISOString()
                        };

                        // Update messages state
                        setMessages(prevMessages => {
                            console.log('WebSocketContext - Adding message, current count:', prevMessages.length);

                            // Check if message already exists to prevent duplicates
                            const messageExists = prevMessages.some(msg =>
                                msg.timestamp === newMessage.timestamp &&
                                msg.content === newMessage.content
                            );

                            if (messageExists) {
                                console.log('WebSocketContext - Duplicate message detected, not adding');
                                return prevMessages;
                            }

                            console.log('WebSocketContext - Adding new message');
                            return [...prevMessages, newMessage];
                        });
                    }
                    break;

                case 'message_deleted':
                    console.log('Message deletion notification received');
                    setMessages(prev => prev.slice(0, -1));
                    break;

                case 'delete_message':
                    console.log('Delete message request processed');
                    // Don't update messages here - wait for server confirmation
                    break;

                case 'clear_messages':
                    console.log('Clear messages command received');
                    setMessages([]);
                    break;

                case 'topic_update':
                    console.log('Topic update received:', message.topic);
                    setCurrentTopic(message.topic);
                    setMessages([]); // Clear messages when topic changes
                    break;

                case 'heartbeat':
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(JSON.stringify({ type: 'heartbeat_ack' }));
                    }
                    break;

                case 'admin_timeout_warning':
                    handleTimeoutWarning(message);
                    break;

                case 'admin_connected':
                    setConnectionStatus({
                        status: 'connected',
                        error: null
                    });
                    break;

                case 'admin_disconnected':
                    setConnectionStatus({
                        status: 'disconnected',
                        error: 'Admin has disconnected'
                    });
                    setAdminSession(null);
                    setCurrentTopic('');
                    setMessages([]);
                    break;

                case 'transfer_response':
                    if (message.status === 'transferred') {
                        setAdminSession({
                            adminId: message.adminId,
                            lastActivity: Date.now()
                        });
                        setConnectionStatus({
                            status: 'connected',
                            error: null
                        });
                    } else {
                        setConnectionStatus({
                            status: 'error',
                            error: message.message || 'Session transfer failed'
                        });
                    }
                    break;

                default:
                    if (message.type !== 'heartbeat_ack') {
                        console.log('Unhandled message type:', message.type);
                    }
            }
        } catch (error) {
            console.error('Error in message handler:', error);
        }
    }, [handleAuthResponse, handleTimeoutWarning]);

    const connect = useCallback(() => {
        if (!shouldConnect) return;

        try {
            console.log('Attempting to connect to WebSocket URL:', config.wsUrl);
            const ws = new WebSocket(config.wsUrl);
            ws.binaryType = 'blob';
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected successfully to:', config.wsUrl);
                setConnectionStatus({
                    status: 'connected',
                    error: null
                });
                startHeartbeat();
            };

            ws.onmessage = async (event) => {
                try {
                    let data;
                    if (event.data instanceof Blob) {
                        const text = await event.data.text();
                        data = JSON.parse(text);
                    } else {
                        data = JSON.parse(event.data);
                    }
                    console.log('WebSocket message received:', data.type, data);

                    // Add more detailed logging for auth-related messages
                    if (data.type === 'auth_response' || data.type === 'admin_auth') {
                        console.log('Authentication-related message received:', data);
                    }
                    handleMessage(data);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };

            ws.onclose = (event) => {
                console.log('WebSocket connection closed:', event.code, event.reason);
                handleUnexpectedClosure(event);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error occurred:', error);
                handleWebSocketError(error);
            };

        } catch (error) {
            console.error('Connection creation failed:', error);
            setConnectionStatus({
                status: 'disconnected',
                error: 'Failed to create connection: ' + error.message
            });
        }
    }, [shouldConnect, startHeartbeat, handleMessage, handleUnexpectedClosure, handleWebSocketError]);

    const disconnect = useCallback(() => {
        setShouldConnect(false);
        if (wsRef.current) {
            wsRef.current.close();
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
        }
        setAdminSession(null);
        setCurrentTopic('');
        setMessages([]);
        setConnectionStatus({
            status: 'disconnected',
            error: null
        });
    }, []);

    const sendMessage = useCallback((message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            console.log('Sending message:', message);
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Message not sent:', message);
        }
    }, []);

    useEffect(() => {
        if (shouldConnect) {
            connect();
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
        };
    }, [shouldConnect, connect]);

    useEffect(() => {
        console.log('WebSocketContext messages state:', messages.length);
    }, [messages]);

    const value = {
        wsRef,
        connectionStatus,
        sendMessage,
        adminSession,
        setAdminSession,
        currentTopic,
        messages,
        setMessages,
        disconnect,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};