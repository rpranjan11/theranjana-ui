// src/confer/client/admin/AdminNavbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../shared/WebSocketContext';
import './AdminNavbar.css';

const AdminNavbar = ({
     connectionStatus,
     selectedTopic,
     onTopicSelect,
     adminSession,
     onLogout
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

    const handleTopicSelect = (topic) => {
        console.log('Topic selected:', topic);
        if (adminSession) {
            sendMessage({
                type: 'topic_update',
                topic: topic
            });
            onTopicSelect(topic);
        }
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
            // First disconnect the WebSocket to prevent reconnection attempts
            disconnect();

            // Clear credentials
            localStorage.removeItem('adminCredentials');
            sessionStorage.removeItem('adminCredentials');

            // Update authentication state in parent component
            // We'll need to add this prop
            if (onLogout) {
                onLogout();
            }

            // Navigate to login page
            // Using replace: true to prevent going back to the admin page with browser back button
            navigate('/confer/client/admin', { replace: true });
        } catch (error) {
            console.error('Error during logout:', error);
            // Even if there's an error, attempt to navigate to login
            navigate('/confer/client/admin', { replace: true });
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
                            onChange={(e) => handleTopicSelect(e.target.value)}
                            disabled={!adminSession}
                            style={{width: topicSelectorWidth}}
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