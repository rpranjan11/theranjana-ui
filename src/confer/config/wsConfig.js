// src/confer/config/wsConfig.js
const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_CONFER_API_HOST || window.location.hostname || '192.168.1.21';
    const port = process.env.REACT_APP_CONFER_API_PORT || '8080';
    return `${protocol}//${host}:${port}`;
};

const config = {
    wsUrl: process.env.REACT_APP_CONFER_API_HOST_URL || getWebSocketUrl(),
    reconnect: {
        initialDelay: 1000,
        maxDelay: 30000,
        factor: 1.5,
        maxAttempts: 10,
        timeout: 10000,
    },
    session: {
        inactivityTimeout: 30 * 60 * 1000, // 30 minutes
        warningTime: 5 * 60 * 1000, // 5 minutes before timeout
        checkInterval: 60 * 1000, // Check every minute
    },
    heartbeat: {
        interval: 15000,
        timeout: 5000,
    }
};

export default config;