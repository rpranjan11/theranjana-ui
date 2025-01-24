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
                case 'initial_state':
                    // Don't modify connection status here
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

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type !== 'heartbeat' && data.type !== 'heartbeat_ack') {
                        console.log('WebSocket message received:', data.type);
                    }
                    handleMessage(data);
                } catch (error) {
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