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
                    // For audience, set initial state
                    if (message.adminId) {
                        setMessages(message.messages || []);
                        setCurrentTopic(message.currentTopic || '');
                    }
                    break;
                case 'initial_state':
                    if (message.currentTopic) {
                        setCurrentTopic(message.currentTopic);
                    }
                    if (message.messages) {
                        setMessages(message.messages);
                    }
                    if (message.adminId) {
                        setAdminSession({
                            adminId: message.adminId,
                            lastActivity: Date.now()
                        });
                    }
                    break;
                case 'new_message':
                    setMessages(prev => [...prev, message.data]);
                    break;
                case 'message_deleted':
                    setMessages(prev => prev.slice(0, -1));
                    break;
                case 'clear_messages':
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
            const ws = new WebSocket(config.wsUrl);
            ws.binaryType = 'blob';
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected with URL:', config.wsUrl);
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
                    handleMessage(data);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };

            ws.onclose = handleUnexpectedClosure;
            ws.onerror = handleWebSocketError;

        } catch (error) {
            console.error('Connection creation failed:', error);
            setConnectionStatus({
                status: 'disconnected',
                error: 'Failed to create connection'
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

    const value = {
        wsRef,
        connectionStatus,
        sendMessage,
        adminSession,
        setAdminSession,
        currentTopic,
        messages,
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