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

    const handleUnexpectedClosure = useCallback((event) => {
        console.warn('WebSocket closed unexpectedly:', event);
        setConnectionStatus({
            status: 'disconnected',
            error: 'Connection lost. Attempting to reconnect...'
        });
        scheduleReconnect();
    }, []);

    const handleInvalidMessage = useCallback((error, data) => {
        console.error('Invalid message received:', error);
        setConnectionStatus(prev => ({
            ...prev,
            error: 'Received invalid data from server'
        }));
    }, []);

    const startHeartbeat = useCallback(() => {
        heartbeatIntervalRef.current = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'heartbeat' }));
            }
        }, config.heartbeat.interval);
    }, []);

    const scheduleReconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
            connect();
        }, config.reconnect.initialDelay);
    }, []);

    const handleMessage = useCallback((message) => {
        try {
            console.log('WebSocket message received:', message.type); // Add debug log
            switch (message.type) {
                case 'auth_response':
                    handleAuthResponse(message);
                    break;
                case 'admin_timeout_warning':
                    handleTimeoutWarning(message);
                    break;
                case 'session_extended':
                    handleSessionExtended(message);
                    break;
                case 'topic_update':
                    console.log('Topic update received:', message); // Add debug log
                    setCurrentTopic(message.topic);
                    break;
                case 'initial_state':
                    console.log('Initial state received:', message); // Add debug log
                    if (message.currentTopic) {
                        setCurrentTopic(message.currentTopic);
                    }
                    break;
                case 'transfer_session_response':
                    if (message.status === 'success') {
                        setConnectionStatus({
                            status: 'connected',
                            error: null
                        });
                        setAdminSession({
                            adminId: message.adminId,
                            lastActivity: Date.now()
                        });
                    } else {
                        setConnectionStatus({
                            status: 'error',
                            error: message.message || 'Session transfer failed'
                        });
                    }
                    break;
                case 'new_message':
                case 'message_deleted':
                case 'admin_disconnected':
                case 'no_active_admin':
                    // These messages are handled by the MessageDisplay component
                    break;
                default:
                    console.log('Unhandled message type:', message.type);
            }
        } catch (error) {
            console.error('Error in message handler:', error);
        }
    }, []);

    const connect = () => {
        if (!shouldConnect) return; // Don't connect if shouldConnect is false

        try {
            const ws = new WebSocket(config.wsUrl);
            ws.binaryType = 'blob';  // Explicitly set binary type
            wsRef.current = ws;

            wsRef.current.onopen = () => {
                setConnectionStatus({
                    status: 'connected',
                    error: null
                });
            };

            ws.onopen = () => {
                console.log('WebSocket connected');
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
                        // Handle Blob data
                        const text = await event.data.text();
                        data = JSON.parse(text);
                    } else {
                        // Handle string data
                        data = JSON.parse(event.data);
                    }

                    if (data.type !== 'heartbeat' && data.type !== 'heartbeat_ack') {
                        console.log('WebSocket message received:', data.type);
                    }
                    handleMessage(data);
                } catch (error) {
                    console.error('WebSocket Error:', error);
                    handleInvalidMessage(error, event.data);
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
    };

    const disconnect = () => {
        setShouldConnect(false); // Prevent auto-reconnection
        if (wsRef.current) {
            wsRef.current.close();
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        setAdminSession(null);
        setConnectionStatus({
            status: 'disconnected',
            error: null
        });
    };

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
        };
    }, [shouldConnect]); // Add shouldConnect to dependency array

    const sendMessage = (message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    };

    const handleAuthResponse = useCallback((message) => {
        if (message.status === 'success') {
            // Verify credentials are in sessionStorage
            const credentials = sessionStorage.getItem('admin_credentials');
            if (!credentials) {
                console.warn('Admin credentials not found in sessionStorage');
                setConnectionStatus({
                    status: 'error',
                    error: 'Authentication credentials missing'
                });
                return;
            }

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

    const handleSessionExtended = useCallback((message) => {
        console.log('Received session_extended response:', message); // Debug level log
        if (message.success) {
            setConnectionStatus({
                status: 'connected',
                error: null
            });
            if (adminSession) {
                setAdminSession({
                    ...adminSession,
                    lastActivity: Date.now()
                });
            }
        }
    }, [adminSession]);

    const value = {
        wsRef,
        connectionStatus,
        sendMessage,
        adminSession,
        setAdminSession,
        currentTopic,
        disconnect, // Add disconnect to context value
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