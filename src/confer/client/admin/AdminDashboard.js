// src/confer/client/admin/AdminDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './AdminDashboard.css';

const AdminDashboard = ({ credentials, selectedTopic }) => {
    const { connectionStatus, adminSession, sendMessage } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [predefinedMessages, setPredefinedMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const messageListRef = useRef(null);

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
            sendMessage({
                type: 'admin_auth',
                credentials
            });
        }
    }, [connectionStatus.status, adminSession, credentials, sendMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const pushMessage = () => {
        if (currentMessageIndex < predefinedMessages.length) {
            const message = {
                ...predefinedMessages[currentMessageIndex],
                timestamp: new Date().toISOString()
            };
            sendMessage({
                type: 'push_message',
                data: message
            });
            setMessages([...messages, message]);
            setCurrentMessageIndex(prev => prev + 1);
        }
    };

    const deleteLastMessage = () => {
        if (messages.length > 0) {
            sendMessage({ type: 'delete_message' });
            setMessages(prev => prev.slice(0, -1));
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
                        >
                            Delete Last Message
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