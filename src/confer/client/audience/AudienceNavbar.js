// src/confer/client/audience/AudienceNavbar.js
import React from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './AudienceNavbar.css';

const AudienceNavbar = () => {
    const { connectionStatus, currentTopic } = useWebSocket();

    // Function to format topic for display
    const formatTopicDisplay = (topic) => {
        if (!topic) return 'No Topic Selected';
        return topic
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Function to get status class
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'connected':
                return 'audience-status-connected';
            case 'connecting':
                return 'audience-status-connecting';
            case 'disconnected':
                return 'audience-status-disconnected';
            case 'timeout_warning':
                return 'audience-status-warning';
            default:
                return '';
        }
    };

    return (
        <nav className="audience-navbar">
            <div className="audience-nav-container">
                <div className="audience-nav-title-section">
                    <h1 className="audience-nav-title">Confer Audience</h1>
                    <div className="audience-nav-subtitle">
                        Confers' Topic: <span className="topic-name">{formatTopicDisplay(currentTopic)}</span>
                    </div>
                </div>

                <div className="audience-connection-status">
                    Status: <span className={`audience-status-text ${getStatusClass(connectionStatus.status)}`}>
                        {connectionStatus.status}
                    </span>
                    {connectionStatus.error && (
                        <p className="error">{connectionStatus.error}</p>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AudienceNavbar;