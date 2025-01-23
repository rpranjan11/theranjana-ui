// src/confer/client/audience/AudiencePage.js
import React, { useEffect, useState } from 'react';
import { WebSocketProvider } from '../shared/WebSocketContext';
import MessageDisplay from './MessageDisplay';
import ConnectionStatus from './ConnectionStatus';
import './AudiencePage.css';

const AudiencePage = () => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        setInitialized(true);
    }, []);

    return (
        <WebSocketProvider>
            <div className="audience-page">
                <ConnectionStatus />
                {initialized && <MessageDisplay />}
            </div>
        </WebSocketProvider>
    );
};

export default AudiencePage;