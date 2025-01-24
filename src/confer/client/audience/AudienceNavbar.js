// src/confer/client/audience/AudienceNavbar.js
import React from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './AudienceNavbar.css';

const AudienceNavbar = () => {
    const { connectionStatus } = useWebSocket();

    // Function to get status class
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'connected':
                return 'status-connected';
            case 'connecting':
                return 'status-connecting';
            case 'disconnected':
                return 'status-disconnected';
            case 'timeout_warning':
                return 'status-warning';
            default:
                return '';
        }
    };

    return (
        <nav className="audience-navbar">
            <div className="navbar-container">
                <div className="navbar-title-section">
                    <h1 className="navbar-title">Confer Audience</h1>
                    <div className="navbar-subtitle">
                        Confers' Topic: <span className="topic-name">Social Customs</span>
                    </div>
                </div>

                <div className="connection-status">
                    Status: <span className={`status-text ${getStatusClass(connectionStatus.status)}`}>
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