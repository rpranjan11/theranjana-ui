// src/confer/client/admin/AdminNavbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../shared/WebSocketContext';
import './AdminNavbar.css';

const AdminNavbar = ({
                         connectionStatus,
                         selectedTopic,
                         onTopicSelect,
                         adminSession
                     }) => {
    const [topicSelectorWidth, setTopicSelectorWidth] = useState('auto');
    const navigate = useNavigate();
    const { sendMessage, wsRef, disconnect } = useWebSocket();

    // Function to format topic for display
    const formatTopicDisplay = (topic) => {
        if (!topic) return '';
        return topic
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Function to get status class
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'connected':
                return 'admin-status-connected';
            case 'connecting':
                return 'admin-status-connecting';
            case 'disconnected':
                return 'admin-status-disconnected';
            case 'timeout_warning':
                return 'admin-status-warning';
            default:
                return '';
        }
    };

    const handleLogout = async () => {
        try {
            // Send logout message to server
            sendMessage({
                type: 'admin_logout'
            });

            // Clear any stored credentials
            localStorage.removeItem('adminCredentials');
            sessionStorage.removeItem('adminCredentials');

            // Call disconnect to cleanup WebSocket context
            disconnect();

            // Navigate to login page
            navigate('/confer/client/admin', { replace: true });
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Update width when topic changes
    useEffect(() => {
        if (selectedTopic) {
            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'nowrap';
            span.style.fontSize = '1rem';
            span.innerText = formatTopicDisplay(selectedTopic);
            document.body.appendChild(span);

            const width = span.offsetWidth + 40;
            setTopicSelectorWidth(`${Math.max(200, width)}px`);

            document.body.removeChild(span);
        } else {
            setTopicSelectorWidth('200px');
        }
    }, [selectedTopic]);

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-container">
                <div className="admin-nav-top-row">
                    <h1 className="admin-nav-title">Confer Admin</h1>
                    <div className={`topic-selector ${selectedTopic ? 'has-selection' : ''}`}
                         style={{ width: topicSelectorWidth }}>
                        <select
                            value={selectedTopic}
                            onChange={(e) => onTopicSelect(e.target.value)}
                            disabled={!adminSession}
                            style={{ width: topicSelectorWidth }}
                        >
                            <option value="">Select Topic</option>
                            <option value="social_customs">Social Customs</option>
                            <option value="geographic_diversity_of_india">Geographic Diversity of India</option>
                        </select>
                    </div>
                </div>

                <div className="admin-nav-bottom-row">
                    <div className="admin-connection-status">
                        Status: <span className={`admin-status-text ${getStatusClass(connectionStatus.status)}`}>
                            {connectionStatus.status}
                        </span>
                        {connectionStatus.error && <p className="error">{connectionStatus.error}</p>}
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;