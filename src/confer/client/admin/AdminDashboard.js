// src/confer/client/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './AdminDashboard.css';

const AdminDashboard = ({ credentials }) => {
    const { connectionStatus, adminSession, sendMessage } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [predefinedMessages, setPredefinedMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0); // Added this state

    useEffect(() => {
        if (connectionStatus.status === 'connected' && !adminSession) {
            sendMessage({
                type: 'admin_auth',
                credentials
            });
        }
    }, [connectionStatus.status, adminSession, credentials, sendMessage]);

    const handleTopicSelect = async (topic) => {
        setSelectedTopic(topic);
        try {
            const messages = await import(`../../confer_topic/${topic}/data/predefinedMessages`);
            setPredefinedMessages(messages.default);
            setCurrentMessageIndex(0); // Reset message index when topic changes
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

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

    if (connectionStatus.status === 'timeout_warning') {
        return (
            <div className="timeout-warning">
                <h2>Session Timeout Warning</h2>
                <p>Your session will expire soon.</p>
                <button onClick={() => sendMessage({ type: 'extend_session' })}>
                    Extend Session
                </button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="connection-status">
                Status: {connectionStatus.status}
                {connectionStatus.error && <p className="error">{connectionStatus.error}</p>}
            </div>

            <div className="topic-selector">
                <select
                    value={selectedTopic}
                    onChange={(e) => handleTopicSelect(e.target.value)}
                    disabled={!adminSession}
                >
                    <option value="">Select Topic</option>
                    <option value="social_customs">Social Customs</option>
                    <option value="geographic_diversity_of_india">Geographic Diversity</option>
                </select>
            </div>

            <div className="message-controls">
                <button
                    onClick={pushMessage}
                    disabled={!adminSession || !selectedTopic || currentMessageIndex >= predefinedMessages.length}
                >
                    Push Next Message
                </button>
                <button
                    onClick={deleteLastMessage}
                    disabled={!adminSession || messages.length === 0}
                >
                    Delete Last Message
                </button>
            </div>

            <div className="message-list">
                {messages.map((message, index) => {
                    return (
                        <div key={index} className="message-item">
                            {message.type === 'image' ? (
                                <div className="image-container">
                                    <img src={message.content} alt="Presentation content"/>
                                    <span className="timestamp">
                                    {message.timestamp && formatTimestamp(message.timestamp)}
                                </span>
                                </div>
                            ) : (
                                <div className="text-container">
                                    <p>{message.content}</p>
                                    <span className="timestamp">
                                    {message.timestamp && formatTimestamp(message.timestamp)}
                                </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminDashboard;