// src/confer/config/wsConfig.js
const getWebSocketUrl = () => {
    const isProduction = process.env.REACT_APP_CONFER_SERVER_ENV === 'production';

    if (isProduction) {
        return process.env.REACT_APP_CONFER_API_HOST_URL;
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