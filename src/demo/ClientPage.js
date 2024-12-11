// src/AudiencePage.js
import React from 'react';
import { AppProvider } from './AppContext';
import ClientComponent from './ClientComponent';

const ClientPage = () => (
    <AppProvider isAdmin={false}>
        <ClientComponent />
    </AppProvider>
);

export default ClientPage;