// src/confer/server/sessionManager.js
const crypto = require('crypto');

class SessionManager {
    constructor() {
        this.activeAdmin = null;
        this.adminTimeout = null;
        this.audiences = new Map(); // clientId -> WebSocket
        this.ADMIN_TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
        this.currentTopic = '';
    }

    // Add method to update topic
    setCurrentTopic(topic) {
        console.log('Setting current topic:', topic); // Add debug log
        this.currentTopic = topic;
    }

    // Add method to get current topic
    getCurrentTopic() {
        return this.currentTopic;
    }

    generateSessionId() {
        return crypto.randomBytes(16).toString('hex');
    }

    setAdmin(ws, credentials) {
        const adminId = this.generateSessionId();
        const adminSession = {
            id: adminId,
            ws,
            credentials,
            lastActivity: Date.now(),
            timeoutRef: null
        };

        // If there's an existing admin, handle transfer
        if (this.activeAdmin) {
            return {
                status: 'existing_session',
                currentAdminId: this.activeAdmin.id
            };
        }

        this.activeAdmin = adminSession;
        this.startAdminTimeout(adminId);

        return {
            status: 'success',
            adminId
        };
    }

    transferAdminSession(newWs, credentials) {
        if (!this.activeAdmin) return { status: 'no_session' };

        // Verify credentials match
        if (this.activeAdmin.credentials !== credentials) {
            return { status: 'invalid_credentials' };
        }

        // Close old connection
        if (this.activeAdmin.ws.readyState === WebSocket.OPEN) {
            this.activeAdmin.ws.close(1000, 'Session transferred');
        }

        // Update admin session
        this.activeAdmin.ws = newWs;
        this.activeAdmin.lastActivity = Date.now();
        this.resetAdminTimeout();

        return {
            status: 'transferred',
            adminId: this.activeAdmin.id
        };
    }

    startAdminTimeout(adminId) {
        if (this.adminTimeout) {
            clearTimeout(this.adminTimeout);
        }

        this.adminTimeout = setTimeout(() => {
            this.handleAdminTimeout(adminId);
        }, this.ADMIN_TIMEOUT_DURATION);
    }

    resetAdminTimeout() {
        if (this.activeAdmin) {
            this.startAdminTimeout(this.activeAdmin.id);
        }
    }

    handleAdminTimeout(adminId) {
        if (this.activeAdmin && this.activeAdmin.id === adminId) {
            // Notify admin of impending timeout
            if (this.activeAdmin.ws.readyState === WebSocket.OPEN) {
                this.activeAdmin.ws.send(JSON.stringify({
                    type: 'admin_timeout_warning',
                    timeoutIn: 60000 // 1 minute warning
                }));
            }

            // Set final timeout for actual disconnect
            setTimeout(() => {
                if (this.activeAdmin && this.activeAdmin.id === adminId) {
                    this.removeAdmin(adminId);
                }
            }, 60000);
        }
    }

    removeAdmin(adminId) {
        if (this.activeAdmin && this.activeAdmin.id === adminId) {
            if (this.activeAdmin.ws.readyState === WebSocket.OPEN) {
                this.activeAdmin.ws.close(1000, 'Session timeout');
            }
            this.activeAdmin = null;
            if (this.adminTimeout) {
                clearTimeout(this.adminTimeout);
                this.adminTimeout = null;
            }
            // Notify all audiences
            this.notifyAudiences({
                type: 'admin_disconnected',
                timestamp: new Date().toISOString()
            });
        }
    }

    addAudience(ws) {
        const clientId = this.generateSessionId();
        this.audiences.set(clientId, ws);
        return clientId;
    }

    removeAudience(clientId) {
        this.audiences.delete(clientId);
    }

    notifyAudiences(message) {
        console.log('Notifying audiences:', message);
        const messageStr = JSON.stringify(message);
        this.audiences.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                try {
                    ws.send(messageStr);
                } catch (error) {
                    console.error('Error sending message to audience:', error);
                }
            }
        });
    }

    getActiveAdminId() {
        return this.activeAdmin?.id || null;
    }

    isAdminActive() {
        return this.activeAdmin !== null;
    }

    updateAdminActivity() {
        if (this.activeAdmin) {
            this.activeAdmin.lastActivity = Date.now();
            this.resetAdminTimeout();
        }
    }

    extendAdminSession() {
        if (this.activeAdmin) {
            this.activeAdmin.lastActivity = Date.now();
            this.resetAdminTimeout();
            return true;
        }
        return false;
    }
}

module.exports = new SessionManager();