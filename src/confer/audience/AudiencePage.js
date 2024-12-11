// src/AudiencePage.js
import React from 'react';
import { AppProvider } from '../social_customs/AppContext';
import ClientComponent from './AudienceComponent';

const ClientPage = () => (
    <AppProvider isAdmin={false}>
        <ClientComponent />
    </AppProvider>
);

export default ClientPage;