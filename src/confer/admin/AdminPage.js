// src/AdminPage.js
import React, { useState } from 'react';
import { AppProvider } from '../AppContext';
import AdminComponent from './AdminComponent';
import LoginPopup from './LoginPopup';

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div>
            {!isAuthenticated && <LoginPopup onLogin={setIsAuthenticated} />}
            {isAuthenticated && (
                <AppProvider isAdmin={true}>
                    <AdminComponent />
                </AppProvider>
            )}
        </div>
    );
};

export default AdminPage;