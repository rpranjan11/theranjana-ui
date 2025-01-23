// src/confer/client/audience/MessageDisplay.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';

const MessageDisplay = () => {
    const { connectionStatus, sendMessage, wsRef } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [adminActive, setAdminActive] = useState(false);
    const [lastAdminId, setLastAdminId] = useState(null);
    const checkAdminIntervalRef = useRef(null);
    const messageListRef = useRef(null);
    const processedMessagesRef = useRef(new Set()); // Track processed messages

    // Memoize the message handler to prevent recreating it on every render
    const handleWebSocketMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.data);

            // Generate a unique message identifier
            const messageId = `${data.type}-${Date.now()}`;

            // Check if we've already processed this message
            if (processedMessagesRef.current.has(messageId)) {
                return;
            }

            // Add message to processed set
            processedMessagesRef.current.add(messageId);

            // Clean up old message IDs (keep only last 100)
            if (processedMessagesRef.current.size > 100) {
                const entries = Array.from(processedMessagesRef.current);
                entries.slice(0, entries.length - 100).forEach(id => {
                    processedMessagesRef.current.delete(id);
                });
            }

            switch (data.type) {
                case 'initial_state':
                    console.log('Processing initial state');
                    if (data.adminId) {
                        setAdminActive(true);
                        setLastAdminId(data.adminId);
                        setMessages(data.messages || []);
                    } else {
                        setAdminActive(false);
                    }
                    break;

                case 'new_message':
                    console.log('Processing new message');
                    setMessages(prev => [...prev, data.data]);
                    setAdminActive(true);
                    break;

                case 'message_deleted':
                    console.log('Processing message deletion');
                    setMessages(prev => prev.slice(0, -1));
                    break;

                case 'admin_disconnected':
                    console.log('Processing admin disconnection');
                    setAdminActive(false);
                    startAdminCheck();
                    break;

                case 'no_active_admin':
                    console.log('Processing no active admin');
                    setAdminActive(false);
                    startAdminCheck();
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }, []);

    // Initial connection effect
    useEffect(() => {
        let isSubscribed = true;

        if (connectionStatus.status === 'connected' && isSubscribed) {
            console.log('Sending initial audience_connect message');
            sendMessage({
                type: 'audience_connect'
            });
        }

        return () => {
            isSubscribed = false;
        };
    }, [connectionStatus.status, sendMessage]);

    // WebSocket message listener effect
    useEffect(() => {
        if (!wsRef.current) return;

        // Add message listener
        wsRef.current.addEventListener('message', handleWebSocketMessage);

        // Cleanup function
        return () => {
            if (wsRef.current) {
                wsRef.current.removeEventListener('message', handleWebSocketMessage);
            }
            // Clear processed messages set
            processedMessagesRef.current.clear();
        };
    }, [wsRef, handleWebSocketMessage]);

    const startAdminCheck = useCallback(() => {
        stopAdminCheck();
        checkAdminIntervalRef.current = setInterval(() => {
            if (connectionStatus.status === 'connected') {
                console.log('Checking for admin availability');
                sendMessage({ type: 'check_admin' });
            }
        }, 60000); // Check every minute
    }, [connectionStatus.status, sendMessage]);

    const stopAdminCheck = useCallback(() => {
        if (checkAdminIntervalRef.current) {
            clearInterval(checkAdminIntervalRef.current);
            checkAdminIntervalRef.current = null;
        }
    }, []);

    // Cleanup effect
    useEffect(() => {
        return () => {
            stopAdminCheck();
        };
    }, [stopAdminCheck]);

    // Auto-scroll effect
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';

        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="message-display">
            {!adminActive && (
                <div className="no-admin-notice">
                    <h2>Waiting for Conference</h2>
                    <p>There is no active conference at the moment.</p>
                    <p>The page will automatically update when a conference begins.</p>
                    {messages.length > 0 && (
                        <p className="previous-session-notice">
                            Showing messages from the previous session
                        </p>
                    )}
                </div>
            )}

            <div className="message-list" ref={messageListRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`message-item ${message.type}`}>
                        {message.type === 'image' ? (
                            <div className="image-container">
                                <img
                                    src={message.content}
                                    alt={`Slide ${index + 1}`}
                                    loading="lazy"
                                />
                                <span className="timestamp">
                                    {message.timestamp ? formatTimestamp(message.timestamp) : ''}
                                </span>
                            </div>
                        ) : (
                            <div className="text-container">
                                <p className="message-content">{message.content}</p>
                                <span className="timestamp">
                                    {message.timestamp ? formatTimestamp(message.timestamp) : ''}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageDisplay;