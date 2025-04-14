// src/confer/client/admin/AdminPage.js
import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebSocketProvider, useWebSocket } from '../shared/WebSocketContext';
import AdminDashboard from './AdminDashboard';
import AdminAuth from './AdminAuth';
import AdminSessionPrompt from './AdminSessionPrompt';
import AdminInactivityMonitor from './AdminInactivityMonitor';
import AdminNavbar from './AdminNavbar';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingSpinner from '../../components/LoadingSpinner';
import './AdminPage.css';

const AdminPageContent = ({ credentials, onLogout }) => {
    const { connectionStatus, adminSession } = useWebSocket();
    const [selectedTopic, setSelectedTopic] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const hasCredentials = localStorage.getItem('adminCredentials') ||
            sessionStorage.getItem('admin_credentials');

        if (!hasCredentials) {
            navigate('/confer/client/admin', { replace: true });
        }
    }, [navigate]);

    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
                <AdminNavbar
                    connectionStatus={connectionStatus}
                    selectedTopic={selectedTopic}
                    onTopicSelect={setSelectedTopic}
                    adminSession={adminSession}
                    onLogout={onLogout}
                />
                <AdminInactivityMonitor />
                <AdminDashboard
                    credentials={credentials}
                    selectedTopic={selectedTopic}
                />
                <AdminSessionPrompt />
            </Suspense>
        </ErrorBoundary>
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