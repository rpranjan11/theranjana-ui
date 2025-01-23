// src/confer/client/audience/ConnectionStatus.js
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
    const { connectionStatus } = useWebSocket();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (connectionStatus.status === 'connected') {
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
        <div className={`connection-status-banner ${connectionStatus.status}`}>
            <span className="status-text">
                {connectionStatus.status === 'connected' ? 'Connected' : 'Connecting...'}
            </span>
            {connectionStatus.error && (
                <span className="error-text">
                    ({connectionStatus.error})
                </span>
            )}
        </div>
    );
};

export default ConnectionStatus;