// src/confer/client/audience/ConnectionStatus.js
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';

const ConnectionStatus = () => {
    const { connectionStatus } = useWebSocket();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (connectionStatus.status === 'connected') {
            // Hide the status after 2 seconds when connected
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setVisible(true);
        }
    }, [connectionStatus.status]);

    if (!visible) return null;

    return (
        <div className="connection-status-banner" style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            backgroundColor: connectionStatus.status === 'connected' ? '#4caf50' : '#ff9800',
            color: 'white',
            borderRadius: '0 0 5px 5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transition: 'all 0.3s ease'
        }}>
            {connectionStatus.status === 'connected' ? 'Connected' : 'Connecting...'}
            {connectionStatus.error && (
                <span style={{ marginLeft: '10px', color: '#ffebee' }}>
                    ({connectionStatus.error})
                </span>
            )}
        </div>
    );
};

export default ConnectionStatus;