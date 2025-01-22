import React from 'react';
import './ConnectionStatusIndicator.css';

const ConnectionStatusIndicator = ({ status, attemptCount, error }) => {
    const getStatusInfo = () => {
        switch (status) {
            case 'connecting':
                return {
                    className: 'status-connecting',
                    icon: '🔄',
                    message: 'Connecting to server...'
                };
            case 'connected':
                return {
                    className: 'status-connected',
                    icon: '✅',
                    message: 'Connected'
                };
            case 'disconnected':
                return {
                    className: 'status-disconnected',
                    icon: '⚠️',
                    message: 'Disconnected - Attempting to reconnect...'
                };
            case 'reconnecting':
                return {
                    className: 'status-reconnecting',
                    icon: '🔄',
                    message: `Reconnecting (Attempt ${attemptCount})...`
                };
            case 'failed':
                return {
                    className: 'status-failed',
                    icon: '❌',
                    message: error || 'Connection failed'
                };
            default:
                return {
                    className: 'status-unknown',
                    icon: '❓',
                    message: 'Unknown connection status'
                };
        }
    };

    const { className, icon, message } = getStatusInfo();

    return (
        <div className={`connection-status-indicator ${className}`} role="status" aria-live="polite">
            <span className="status-icon" aria-hidden="true">{icon}</span>
            <span className="status-message">{message}</span>
            {status === 'failed' && error && (
                <div className="error-details">
                    <p>Error Details: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-button"
                    >
                        Retry Connection
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConnectionStatusIndicator;