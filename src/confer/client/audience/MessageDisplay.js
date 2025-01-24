// src/confer/client/audience/MessageDisplay.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './MessageDisplay.css';

const MessageDisplay = () => {
    const { connectionStatus, sendMessage, wsRef } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [adminActive, setAdminActive] = useState(false);
    const [lastAdminId, setLastAdminId] = useState(null);
    const checkAdminIntervalRef = useRef(null);
    const messageListRef = useRef(null);
    const processedMessagesRef = useRef(new Set());
    const messageHandlerRef = useRef(null);

    // Define stopAdminCheck first
    const stopAdminCheck = useCallback(() => {
        if (checkAdminIntervalRef.current) {
            clearInterval(checkAdminIntervalRef.current);
            checkAdminIntervalRef.current = null;
        }
    }, []);

    // Then define startAdminCheck
    const startAdminCheck = useCallback(() => {
        stopAdminCheck();
        checkAdminIntervalRef.current = setInterval(() => {
            if (connectionStatus.status === 'connected') {
                console.log('Checking for admin availability');
                sendMessage({ type: 'check_admin' });
            }
        }, 60000); // Check every minute
    }, [connectionStatus.status, sendMessage, stopAdminCheck]);

    // Now define handleWebSocketMessage with startAdminCheck in scope
    const handleWebSocketMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.data);
            // Create a unique identifier for the message
            const messageId = `${data.type}-${data.timestamp || Date.now()}`;

            // Skip if we've already processed this message
            if (processedMessagesRef.current.has(messageId)) {
                return;
            }

            // Add to processed messages set
            processedMessagesRef.current.add(messageId);

            switch (data.type) {
                case 'initial_state':
                    console.log('Processing initial state');
                    if (data.adminId) {
                        setAdminActive(true);
                        setLastAdminId(data.adminId);
                        // Only set messages if they exist and aren't empty
                        if (data.messages && data.messages.length > 0) {
                            setMessages(data.messages);
                        }
                    } else {
                        setAdminActive(false);
                        setMessages([]); // Clear messages when no admin is active
                    }
                    break;

                case 'new_message':
                    console.log('Processing new message', data.data);
                    setMessages(prev => {
                        // Check if message already exists in the array
                        const messageExists = prev.some(msg =>
                            msg.timestamp === data.data.timestamp &&
                            msg.content === data.data.content
                        );
                        if (messageExists) {
                            return prev;
                        }
                        return [...prev, data.data];
                    });
                    setAdminActive(true);
                    break;

                case 'message_deleted':
                    console.log('Processing message deletion');
                    setMessages(prev => prev.slice(0, -1));
                    break;

                case 'admin_disconnected':
                    console.log('Processing admin disconnection');
                    setAdminActive(false);
                    setMessages([]); // Clear messages when admin disconnects
                    startAdminCheck();
                    break;

                case 'no_active_admin':
                    console.log('Processing no active admin');
                    setAdminActive(false);
                    setMessages([]); // Clear messages when there's no active admin
                    startAdminCheck();
                    break;

                case 'clear_messages':
                    console.log('Processing clear messages command');
                    setMessages([]); // Clear messages when topic changes
                    if (data.adminId) {
                        setAdminActive(true);
                        setLastAdminId(data.adminId);
                    }
                    break;

                default:
                    console.log('Unhandled message type:', data.type);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    }, [startAdminCheck]);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        if (messageListRef.current) {
            const scrollHeight = messageListRef.current.scrollHeight;
            const height = messageListRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            messageListRef.current.scrollTo({
                top: maxScrollTop > 0 ? maxScrollTop : 0,
                behavior
            });
        }
    }, []);

    // Auto-scroll effect - enhanced version
    useEffect(() => {
        if (messages.length > 0) {
            // Initial load - instant scroll
            scrollToBottom('auto');

            // Additional scroll after a short delay to ensure images are loaded
            const timeoutId = setTimeout(() => {
                scrollToBottom('auto');
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [messages, scrollToBottom]);

    // Add scroll to bottom when images load
    const handleImageLoad = useCallback(() => {
        scrollToBottom('auto');
    }, [scrollToBottom]);

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

    // WebSocket message listener effect with cleanup
    useEffect(() => {
        if (!wsRef.current) return;

        // Remove existing message handler if it exists
        if (messageHandlerRef.current) {
            wsRef.current.removeEventListener('message', messageHandlerRef.current);
        }

        // Store the new message handler
        messageHandlerRef.current = handleWebSocketMessage;

        // Add the message listener
        wsRef.current.addEventListener('message', messageHandlerRef.current);

        // Clear processed messages set on mount
        processedMessagesRef.current.clear();

        // Cleanup function
        return () => {
            if (wsRef.current && messageHandlerRef.current) {
                wsRef.current.removeEventListener('message', messageHandlerRef.current);
            }
            processedMessagesRef.current.clear();
        };
    }, [wsRef, handleWebSocketMessage]);

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
        <div className="audience-message-display">
            <div
                className={`audience-message-list ${!adminActive || messages.length === 0 ? 'empty' : ''}`}
                ref={messageListRef}
            >
                {(!adminActive || messages.length === 0) && (
                    <div className="audience-no-admin-notice">
                        <h2>Waiting for Conference</h2>
                        <p>There is no active conference at the moment.</p>
                        <p>The page will automatically update when a conference begins.</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div key={`${message.timestamp}-${index}`} className="audience-message-item">
                        {message.type === 'image' ? (
                            <div className="audience-image-container">
                                <img
                                    src={message.content}
                                    alt={`Slide ${index + 1}`}
                                    loading="lazy"
                                    onLoad={handleImageLoad}  // Add onLoad handler for images
                                />
                            </div>
                        ) : (
                            <div className="audience-text-container">
                                <p>{message.content}</p>
                            </div>
                        )}
                        <span className="audience-message-timestamp">
                            {message.timestamp && formatTimestamp(message.timestamp)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageDisplay;