// src/confer/config.js
const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    // Use window.location.hostname as default, fallback to IP
    const host = process.env.REACT_APP_WS_HOST || window.location.hostname || '192.168.1.21';
    const port = process.env.REACT_APP_WS_PORT || '8080';

    const url = `${protocol}//${host}:${port}`;
    console.log(`🔌 Constructing WebSocket URL: ${url}`);
    return url;
};

const config = {
    wsUrl: process.env.REACT_APP_CONFER_API_WS_URL || getWebSocketUrl(),
    wsReconnect: {
        maxAttempts: 5,
        initialDelay: 1000,    // Start with 1 second
        maxDelay: 30000,       // Max 30 seconds
        timeout: 10000,        // 10 seconds connection timeout
    },
    ping: {
        interval: 15000,       // 15 seconds
        timeout: 5000          // 5 seconds timeout for ping response
    },
    validateConfig: () => {
        if (!config.wsUrl) {
            throw new Error('WebSocket URL is not configured');
        }

        try {
            new URL(config.wsUrl);
        } catch (error) {
            throw new Error(`Invalid WebSocket URL format: ${config.wsUrl}`);
        }

        // Log the configuration
        console.log('📝 WebSocket Configuration:', {
            url: config.wsUrl,
            reconnect: config.wsReconnect,
            ping: config.ping
        });

        // Check if we're trying to use ws:// on HTTPS
        if (typeof window !== 'undefined' &&
            window.location.protocol === 'https:' &&
            !config.wsUrl.startsWith('wss://')) {
            console.warn('⚠️ Warning: Using insecure WebSocket (ws://) on an HTTPS connection');
        }
    }
};

export default config;