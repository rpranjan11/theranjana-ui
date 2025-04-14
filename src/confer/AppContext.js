// src/confer/AppContext.js
import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import config from './config';

export const AppContext = createContext();

export const AppProvider = ({ children, isAdmin }) => {
    // State declarations
    const [messages, setMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [predefinedMessages, setPredefinedMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState({
        status: 'connecting',
        lastAttempt: null,
        attemptCount: 0,
        error: null
    });

    // Refs
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const pingIntervalRef = useRef(null);
    const connectionTimeoutRef = useRef(null);

    // Helper function to calculate reconnection delay with exponential backoff
    const getReconnectDelay = useCallback((attemptCount) => {
        return Math.min(
            config.wsReconnect.initialDelay * Math.pow(1.5, attemptCount),
            config.wsReconnect.maxDelay
        );
    }, []);

    // Cleanup function
    const cleanupConnection = useCallback(() => {
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
        }
        if (socketRef.current) {
            socketRef.current.close(1000, 'Cleanup');
            socketRef.current = null;
        }
    }, []);

    // Load predefined messages
    const setPredefinedMessagesFile = async (fileName) => {
        try {
            const module = await import(`./${fileName}/data/predefinedMessages`);
            setPredefinedMessages(module.default);
        } catch (error) {
            console.error('Error loading predefined messages:', error);
            setError('Failed to load messages');
        }
    };

    const connectWebSocket = useCallback(() => {
        // Don't try to reconnect if we've exceeded max attempts
        if (connectionStatus.attemptCount >= config.wsReconnect.maxAttempts) {
            setConnectionStatus(prev => ({
                ...prev,
                status: 'failed',
                error: 'Maximum reconnection attempts reached'
            }));
            return;
        }

        // Cleanup any existing connection
        cleanupConnection();

        try {
            config.validateConfig();

            setConnectionStatus(prev => ({
                ...prev,
                status: prev.status === 'disconnected' ? 'reconnecting' : 'connecting',
                lastAttempt: new Date(),
                attemptCount: prev.attemptCount + 1,
                error: null
            }));

            console.log(`🔌 Attempting to connect to: ${config.wsUrl}`);
            const ws = new WebSocket(config.wsUrl);
            socketRef.current = ws;

            // Set connection timeout
            connectionTimeoutRef.current = setTimeout(() => {
                if (ws.readyState !== WebSocket.OPEN) {
                    console.log('⚠️ Connection timeout - closing socket');
                    ws.close();
                    setConnectionStatus(prev => ({
                        ...prev,
                        status: 'failed',
                        error: 'Connection timeout'
                    }));
                }
            }, config.wsReconnect.timeout);

            ws.onopen = () => {
                console.log('✅ WebSocket connection established');
                setIsConnected(true);
                setConnectionStatus({
                    status: 'connected',
                    lastAttempt: null,
                    attemptCount: 0,
                    error: null
                });

                // Clear connection timeout
                if (connectionTimeoutRef.current) {
                    clearTimeout(connectionTimeoutRef.current);
                    connectionTimeoutRef.current = null;
                }

                // Setup ping interval
                pingIntervalRef.current = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        try {
                            ws.send(JSON.stringify({ type: 'ping' }));
                        } catch (error) {
                            console.error('❌ Error sending ping:', error);
                        }
                    }
                }, config.ping.interval);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'pong') {
                        console.log('📍 Received pong from server');
                        return;
                    }

                    switch (data.type) {
                        case 'connection_status':
                            console.log('📍 Connection status:', data.status);
                            break;
                        case 'initial':
                            setMessages(data.data);
                            break;
                        case 'newMessage':
                            setMessages(prev => [...prev, data.data]);
                            break;
                        case 'deleteMessage':
                            setMessages(prev => prev.slice(0, -1));
                            break;
                        default:
                            console.log('📍 Received message:', data);
                    }
                } catch (error) {
                    console.error('❌ Error processing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket Error:', error);
                setError('Connection error occurred');
                setIsConnected(false);
            };

            ws.onclose = (event) => {
                console.log(`📍 WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
                setIsConnected(false);

                // Don't attempt to reconnect if it was a normal closure
                if (event.code === 1000 || event.code === 1001) {
                    setConnectionStatus(prev => ({
                        ...prev,
                        status: 'disconnected',
                        error: null
                    }));
                    return;
                }

                setConnectionStatus(prev => ({
                    ...prev,
                    status: 'disconnected',
                    error: `Connection closed: ${event.reason || 'Unknown reason'}`
                }));

                // Schedule reconnection
                const delay = getReconnectDelay(connectionStatus.attemptCount);
                console.log(`🔄 Scheduling reconnection in ${delay}ms`);
                reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
            };

        } catch (error) {
            console.error('❌ Failed to create WebSocket connection:', error);
            setConnectionStatus(prev => ({
                ...prev,
                status: 'failed',
                error: error.message
            }));
        }
    }, [connectionStatus.attemptCount, getReconnectDelay, cleanupConnection]);

    // Initial connection
    useEffect(() => {
        connectWebSocket();
        return cleanupConnection;
    }, [connectWebSocket, cleanupConnection]);

    const sendWebSocketMessage = useCallback((message) => {
        return new Promise((resolve, reject) => {
            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                reject(new Error('WebSocket is not connected'));
                return;
            }

            try {
                socketRef.current.send(JSON.stringify(message));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }, []);

    const pushNextMessage = async () => {
        if (!isAdmin) return;

        if (currentMessageIndex < predefinedMessages.length) {
            try {
                const nextMessage = predefinedMessages[currentMessageIndex];
                await sendWebSocketMessage({ type: 'newMessage', data: nextMessage });
                setMessages(prev => [...prev, nextMessage]);
                setCurrentMessageIndex(prev => prev + 1);
                setError(null);
            } catch (error) {
                console.error('Failed to send message:', error);
                setError('Failed to send message. Please try again.');
            }
        }
    };

    const deleteLastMessage = async () => {
        if (!isAdmin || messages.length === 0) return;

        try {
            await sendWebSocketMessage({ type: 'deleteMessage' });
            setMessages(prev => prev.slice(0, -1));
            setCurrentMessageIndex(prev => prev - 1);
        } catch (error) {
            console.error('Failed to delete message:', error);
            setError('Failed to delete message');
        }
    };

    return (
        <AppContext.Provider value={{
            messages,
            setMessages,
            currentMessageIndex,
            setCurrentMessageIndex,
            pushNextMessage,
            deleteLastMessage,
            setPredefinedMessagesFile,
            isConnected,
            connectionStatus,
            error
        }}>
            {children}
        </AppContext.Provider>
    );
};