// src/confer/server/messageStore.js
class MessageStore {
    constructor() {
        this.adminMessages = new Map(); // adminId -> messages[]
    }

    addMessage(adminId, message) {
        if (!this.adminMessages.has(adminId)) {
            this.adminMessages.set(adminId, []);
        }
        const messageWithTimestamp = {
            ...message,
            timestamp: new Date().toISOString()
        };
        this.adminMessages.get(adminId).push(messageWithTimestamp);
        return messageWithTimestamp;
    }

    deleteLastMessage(adminId) {
        if (this.adminMessages.has(adminId)) {
            const messages = this.adminMessages.get(adminId);
            if (messages.length > 0) {
                return messages.pop();
            }
        }
        return null;
    }

    getMessages(adminId) {
        return this.adminMessages.get(adminId) || [];
    }

    clearMessages(adminId) {
        this.adminMessages.delete(adminId);
    }
}

module.exports = new MessageStore();