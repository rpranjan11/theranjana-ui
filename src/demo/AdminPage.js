// src/AdminPage.js
import React from 'react';
import { AppProvider } from './AppContext';
import AdminComponent from './AdminComponent';

const AdminPage = () => (
    <AppProvider isAdmin={true}>
        <AdminComponent />
    </AppProvider>
);

export default AdminPage;