// src/confer/client/admin/AdminPage.js
import React, { useState } from 'react';
import { WebSocketProvider } from '../shared/WebSocketContext';
import AdminDashboard from './AdminDashboard';
import AdminAuth from './AdminAuth';  // Add this import
import AdminSessionPrompt from './AdminSessionPrompt';
import AdminInactivityMonitor from './AdminInactivityMonitor';

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
                    <>
                        <AdminInactivityMonitor />
                        <AdminDashboard credentials={credentials} />
                        <AdminSessionPrompt />
                    </>
                )}
            </div>
        </WebSocketProvider>
    );
};

export default AdminPage;