// src/confer/client/admin/AdminDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './AdminDashboard.css';

const AdminDashboard = ({ credentials, selectedTopic }) => {
    const { connectionStatus, adminSession, sendMessage, messages, setMessages } = useWebSocket();
    const [predefinedMessages, setPredefinedMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const messageListRef = useRef(null);

    console.log('AdminDashboard render state:', {
        adminSession,
        messagesLength: messages ? messages.length : 'null',
        disabledCondition: !adminSession || messages.length === 0,
        currentMessageIndex,
        predefinedMessagesLength: predefinedMessages ? predefinedMessages.length : 'null'
    });

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    // Reset messages when topic changes
    useEffect(() => {
        // Clear messages when topic changes
        setMessages([]);
        setCurrentMessageIndex(0);

        // Notify server about clearing messages
        if (adminSession) {
            sendMessage({
                type: 'clear_messages'
            });
        }

        // Load new messages for the selected topic
        const loadMessages = async () => {
            if (selectedTopic) {
                try {
                    const messages = await import(`../../confer_topic/${selectedTopic}/data/predefinedMessages`);
                    setPredefinedMessages(messages.default);
                } catch (error) {
                    console.error('Error loading messages:', error);
                    setPredefinedMessages([]);
                }
            }
        };

        loadMessages();
    }, [selectedTopic, adminSession, sendMessage]);

    useEffect(() => {
        if (connectionStatus.status === 'connected' && !adminSession) {
            console.log('Sending admin auth message with credentials:', credentials);
            try {
                sendMessage({
                    type: 'admin_auth',
                    credentials
                });
            } catch (error) {
                console.error('Error sending admin authentication:', error);
            }
        }
    }, [connectionStatus.status, adminSession, credentials, sendMessage]);

    // Add this effect to handle topic selection
    useEffect(() => {
        if (selectedTopic && adminSession) {
            console.log('Topic selection state:', {
                selectedTopic,
                adminSession,
                connectionStatus
            });
            sendMessage({
                type: 'topic_update',
                topic: selectedTopic
            });
        }
    }, [selectedTopic, adminSession, sendMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        console.log('Messages changed in AdminDashboard:', messages.length);
        // Force re-render when messages change
        const forceUpdate = setTimeout(() => {}, 0);
        return () => clearTimeout(forceUpdate);
    }, [messages]);

    const pushMessage = () => {
        console.log('Push button clicked, current state:', {
            currentMessageIndex,
            predefinedMessagesLength: predefinedMessages.length,
            canPush: currentMessageIndex < predefinedMessages.length
        });

        if (currentMessageIndex < predefinedMessages.length) {
            const message = {
                ...predefinedMessages[currentMessageIndex],
                timestamp: new Date().toISOString()
            };
            console.log('Sending push message:', message);
            sendMessage({
                type: 'push_message',
                data: message
            });
            setCurrentMessageIndex(prev => prev + 1);
        }
    };

    const deleteLastMessage = () => {
        if (messages.length > 0) {
            console.log('Sending delete message request');
            sendMessage({ type: 'delete_message' });

            // Let WebSocketContext handle message state updates
            setCurrentMessageIndex(prev => prev - 1);
        }
    };

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
        <div className="admin-dashboard">
            {connectionStatus.status === 'timeout_warning' ? (
                <div className="timeout-warning">
                    <h2>Session Timeout Warning</h2>
                    <p>Your session will expire soon.</p>
                    <button onClick={() => sendMessage({ type: 'extend_session' })}>
                        Extend Session
                    </button>
                </div>
            ) : (
                <>
                    <div className="admin-message-controls">
                        <button
                            onClick={pushMessage}
                            disabled={!adminSession || !selectedTopic || currentMessageIndex >= predefinedMessages.length}
                        >
                            Push Next Message
                        </button>
                        <button
                            className="delete-button"
                            onClick={deleteLastMessage}
                            disabled={!adminSession || messages.length === 0}
                            data-admin={!!adminSession}
                            data-messages={messages.length}
                        >
                            Delete Last Message ({messages.length} messages)
                        </button>
                    </div>

                    <div className="admin-message-list admin-content-container" ref={messageListRef}>
                        {messages.map((message, index) => (
                            <div key={index} className="admin-message-item">
                                {message.type === 'image' ? (
                                    <div className="admin-image-container">
                                        <img src={message.content} alt="Presentation content"/>
                                    </div>
                                ) : (
                                    <div className="admin-text-container">
                                        <p>{message.content === "ThankYou | 감사합니다" ?
                                            <span style={{
                                                display: 'block',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '1.5em'
                                            }}>
                                    {message.content}
                                    </span>
                                            :
                                            message.content.includes("<=>") ?
                                                <>
                                                    {message.content.split("<=>")[0]}
                                                    <div style={{
                                                        color: '#1a73e8',
                                                        textAlign: 'start',
                                                        fontWeight: 'bold',
                                                        fontSize: '1em'
                                                    }}>&lt;=&gt;</div>
                                                    {message.content.split("<=>")[1]}
                                                </>
                                                :
                                                message.content}
                                        </p>
                                    </div>
                                )}
                                <span className="admin-message-timestamp">
                                    {message.timestamp && formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;