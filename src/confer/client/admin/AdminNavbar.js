// src/confer/client/admin/AdminNavbar.js
import React, { useEffect, useState } from 'react';
import './AdminNavbar.css';

const AdminNavbar = ({
                         connectionStatus,
                         selectedTopic,
                         onTopicSelect,
                         adminSession
                     }) => {
    const [topicSelectorWidth, setTopicSelectorWidth] = useState('auto');

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

    // Update width when topic changes
    useEffect(() => {
        if (selectedTopic) {
            // Create a temporary span to measure text width
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
            <div className="navbar-container">
                <div className="connection-status">
                    Status: <span className={`status-text ${getStatusClass(connectionStatus.status)}`}>
                        {connectionStatus.status}
                    </span>
                    {connectionStatus.error && <p className="error">{connectionStatus.error}</p>}
                </div>

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
        </nav>
    );
};

export default AdminNavbar;