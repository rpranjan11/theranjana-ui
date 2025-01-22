// src/confer/client/admin/AdminSessionPrompt.js
import React from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './AdminSessionPrompt.css';

const AdminSessionPrompt = () => {
    const { connectionStatus, sendMessage } = useWebSocket();

    if (connectionStatus.status !== 'existing_session') {
        return null;
    }

    const handleTransfer = () => {
        sendMessage({
            type: 'transfer_session',
            credentials: sessionStorage.getItem('admin_credentials')
        });
    };

    return (
        <div className="session-prompt-overlay">
            <div className="session-prompt-modal">
                <h2>Existing Session Detected</h2>
                <p>Would you like to continue your session here?</p>
                <p>The session on the other device will be disconnected.</p>
                <div className="prompt-buttons">
                    <button onClick={handleTransfer}>
                        Continue Here
                    </button>
                    <button onClick={() => window.location.reload()}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSessionPrompt;