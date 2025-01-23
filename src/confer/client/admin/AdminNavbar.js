import React from 'react';
import './AdminNavbar.css';

const AdminNavbar = ({
                         connectionStatus,
                         selectedTopic,
                         onTopicSelect,
                         adminSession
                     }) => {
    return (
        <nav className="admin-navbar">
            <div className="navbar-container">
                <div className="connection-status">
                    Status: {connectionStatus.status}
                    {connectionStatus.error && <p className="error">{connectionStatus.error}</p>}
                </div>

                <div className="topic-selector">
                    <select
                        value={selectedTopic}
                        onChange={(e) => onTopicSelect(e.target.value)}
                        disabled={!adminSession}
                    >
                        <option value="">Select Topic</option>
                        <option value="social_customs">Social Customs</option>
                        <option value="geographic_diversity_of_india">Geographic Diversity</option>
                    </select>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;