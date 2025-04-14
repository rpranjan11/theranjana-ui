// src/confer/utils/wsUtils.js
export const calculateReconnectDelay = (attempt, config) => {
    const delay = config.reconnect.initialDelay *
        Math.pow(config.reconnect.factor, attempt);
    return Math.min(delay, config.reconnect.maxDelay);
};

export const isConnectionValid = (ws) => {
    return ws && ws.readyState === WebSocket.OPEN;
};

export const formatConnectionError = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown connection error occurred';
};