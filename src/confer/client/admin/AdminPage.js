// src/confer/client/admin/AdminPage.js
import React, { useState } from 'react';
import { WebSocketProvider, useWebSocket } from '../shared/WebSocketContext';
import AdminDashboard from './AdminDashboard';
import AdminAuth from './AdminAuth';
import AdminSessionPrompt from './AdminSessionPrompt';
import AdminInactivityMonitor from './AdminInactivityMonitor';
import AdminNavbar from './AdminNavbar';
import './AdminPage.css';

const AdminPageContent = ({ credentials }) => {
    const { connectionStatus, adminSession } = useWebSocket();
    const [selectedTopic, setSelectedTopic] = useState('');

    return (
        <>
            <AdminNavbar
                connectionStatus={connectionStatus}
                selectedTopic={selectedTopic}
                onTopicSelect={setSelectedTopic}
                adminSession={adminSession}
            />
            <AdminInactivityMonitor />
            <AdminDashboard
                credentials={credentials}
                selectedTopic={selectedTopic}
            />
            <AdminSessionPrompt />
        </>
    );
};

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [credentials, setCredentials] = useState('');

    return (
        <WebSocketProvider>
            <div className="admin-page">
                {!isAuthenticated ? (
                    <AdminAuth
                        onAuth={(creds) => {
                            setCredentials(creds);
                            setIsAuthenticated(true);
                        }}
                    />
                ) : (
                    <AdminPageContent credentials={credentials} />
                )}
            </div>
        </WebSocketProvider>
    );
};

export default AdminPage;