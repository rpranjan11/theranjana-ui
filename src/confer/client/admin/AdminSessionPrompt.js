// src/confer/client/admin/AdminSessionPrompt.js
import React, {useState} from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './AdminSessionPrompt.css';

const AdminSessionPrompt = () => {
    const { connectionStatus, sendMessage } = useWebSocket();
    const [isTransferring, setIsTransferring] = useState(false);

    if (connectionStatus.status !== 'existing_session') {
        return null;
    }

    const handleTransfer = () => {
        console.log('Initiating session transfer'); // Debug level log
        const credentials = sessionStorage.getItem('admin_credentials');
        if (!credentials) {
            console.error('No admin credentials found');
            // Optionally show user-friendly error message
            alert('Session credentials not found. Please try logging in again.');
            window.location.reload(); // Reload to show login screen
            return;
        }

        setIsTransferring(true);
        console.log('Sending transfer_session message'); // Debug level log
        sendMessage({
            type: 'transfer_session',
            credentials: credentials
        });
    };

    return (
        <div className="admin-session-prompt-overlay">
            <div className="admin-session-prompt-modal">
                <h2>Existing Session Detected</h2>
                <p>Would you like to continue your session here?</p>
                <p>The session on the other device will be disconnected.</p>
                <div className="admin-prompt-buttons">
                    <button
                        onClick={handleTransfer}
                        disabled={isTransferring}
                    >
                        {isTransferring ? 'Transferring...' : 'Continue Here'}
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