// src/confer/client/admin/AdminInactivityMonitor.js
import React, { useEffect, useRef } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
const INACTIVITY_THRESHOLD = 25 * 60 * 1000; // 25 minutes

const AdminInactivityMonitor = () => {
    const { connectionStatus, sendMessage } = useWebSocket();
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            sendMessage({ type: 'extend_session' });
        }, INACTIVITY_THRESHOLD);
    };

    useEffect(() => {
        const handleActivity = () => {
            resetTimeout();
        };

        ACTIVITY_EVENTS.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        resetTimeout();

        return () => {
            ACTIVITY_EVENTS.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return null;
};

export default AdminInactivityMonitor;