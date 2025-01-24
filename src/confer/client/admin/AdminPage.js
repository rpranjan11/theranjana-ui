// src/confer/client/admin/AdminPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { WebSocketProvider, useWebSocket } from '../shared/WebSocketContext';
import AdminDashboard from './AdminDashboard';
import AdminAuth from './AdminAuth';
import AdminSessionPrompt from './AdminSessionPrompt';
import AdminInactivityMonitor from './AdminInactivityMonitor';
import AdminNavbar from './AdminNavbar';
import './AdminPage.css';

const AdminPageContent = ({ credentials, onLogout }) => {
    const { connectionStatus, adminSession } = useWebSocket();
    const [selectedTopic, setSelectedTopic] = useState('');
    const navigate = useNavigate(); // Add this

    useEffect(() => {
        // Check if there are no credentials stored
        const hasCredentials = localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('adminCredentials');

        if (!hasCredentials) {
            navigate('/confer/client/admin', { replace: true });
        }
    }, [navigate]);

    return (
        <>
            <AdminNavbar
                connectionStatus={connectionStatus}
                selectedTopic={selectedTopic}
                onTopicSelect={setSelectedTopic}
                adminSession={adminSession}
                onLogout={onLogout}  // Pass the logout handler
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

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCredentials('');
    };

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
                    <AdminPageContent
                        credentials={credentials}
                        onLogout={handleLogout}
                    />
                )}
            </div>
        </WebSocketProvider>
    );
};

export default AdminPage;