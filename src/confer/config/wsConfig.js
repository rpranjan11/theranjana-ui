// src/confer/config/wsConfig.js
const getWebSocketUrl = () => {
    const isProduction = process.env.REACT_APP_CONFER_SERVER_ENV === 'production';

    if (isProduction) {
        // Get the WebSocket URL from environment variable
        const wsUrl = process.env.REACT_APP_CONFER_API_HOST_URL || '';
        // Ensure we're using wss:// for secure connections
        if (wsUrl.startsWith('https://')) {
            return wsUrl.replace('https://', 'wss://');
        } else if (wsUrl.startsWith('http://')) {
            return wsUrl.replace('http://', 'ws://');
        }
        return `wss://${wsUrl}`;
    } else {
        // For local development
        const host = process.env.REACT_APP_CONFER_API_HOST || window.location.hostname;
        const port = process.env.REACT_APP_CONFER_API_PORT || '8080';
        return `ws://${host}:${port}`;
    }
};

const config = {
    wsUrl: getWebSocketUrl(),
    reconnect: {
        initialDelay: 1000,
        maxDelay: 30000,
        factor: 1.5,
        maxAttempts: 10,
        timeout: 10000,
    },
    session: {
        inactivityTimeout: 30 * 60 * 1000,
        warningTime: 5 * 60 * 1000,
        checkInterval: 60 * 1000,
    },
    heartbeat: {
        interval: 15000,
        timeout: 5000,
    }
};

export default config;