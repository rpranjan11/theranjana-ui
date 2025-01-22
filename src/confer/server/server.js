// src/confer/server/server.js
const WebSocket = require('ws');
const http = require('http');
const sessionManager = require('./sessionManager');
const messageStore = require('./messageStore');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify({ status: 'Server is running' }));
});

const wss = new WebSocket.Server({ server });

const handleAdminMessage = (ws, message, adminId) => {
    try {
        switch (message.type) {
            case 'push_message':
                const newMessage = messageStore.addMessage(adminId, message.data);
                sessionManager.notifyAudiences({
                    type: 'new_message',
                    data: newMessage,
                    adminId
                });
                break;

            case 'delete_message':
                const deletedMessage = messageStore.deleteLastMessage(adminId);
                if (deletedMessage) {
                    sessionManager.notifyAudiences({
                        type: 'message_deleted',
                        timestamp: new Date().toISOString(),
                        adminId
                    });
                }
                break;

            case 'extend_session':
                const extended = sessionManager.extendAdminSession();
                ws.send(JSON.stringify({
                    type: 'session_extended',
                    success: extended
                }));
                break;

            case 'heartbeat':
                sessionManager.updateAdminActivity();
                ws.send(JSON.stringify({ type: 'heartbeat_ack' }));
                break;
        }
    } catch (error) {
        console.error('Error handling admin message:', error);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process message'
        }));
    }
};

wss.on('connection', (ws, req) => {
    console.log('New connection established');

    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);

            switch (message.type) {
                case 'admin_auth':
                    const authResult = sessionManager.setAdmin(ws, message.credentials);
                    if (authResult.status === 'existing_session') {
                        ws.send(JSON.stringify({
                            type: 'auth_response',
                            status: 'existing_session',
                            message: 'Another session is active. Would you like to continue here?'
                        }));
                    } else if (authResult.status === 'success') {
                        const adminId = authResult.adminId;
                        ws.adminId = adminId;
                        ws.isAdmin = true;
                        ws.send(JSON.stringify({
                            type: 'auth_response',
                            status: 'success',
                            adminId
                        }));
                    }
                    break;

                case 'transfer_session':
                    const transferResult = sessionManager.transferAdminSession(ws, message.credentials);
                    ws.send(JSON.stringify({
                        type: 'transfer_response',
                        ...transferResult
                    }));
                    break;

                case 'audience_connect':
                    const clientId = sessionManager.addAudience(ws);
                    ws.clientId = clientId;
                    ws.isAudience = true;

                    // Send initial state
                    const adminId = sessionManager.getActiveAdminId();
                    if (adminId) {
                        const messages = messageStore.getMessages(adminId);
                        ws.send(JSON.stringify({
                            type: 'initial_state',
                            adminId,
                            messages
                        }));
                    } else {
                        ws.send(JSON.stringify({
                            type: 'no_active_admin'
                        }));
                    }
                    break;

                case 'push_message':
                    if (ws.isAdmin) {
                        const newMessage = {
                            ...message.data,
                            timestamp: new Date().toISOString()
                        };
                        messageStore.addMessage(ws.adminId, newMessage);
                        sessionManager.notifyAudiences({
                            type: 'new_message',
                            data: newMessage,
                            adminId: ws.adminId
                        });
                    }
                    break;

                default:
                    if (ws.isAdmin) {
                        handleAdminMessage(ws, message, ws.adminId);
                    }
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format'
            }));
        }
    });

    ws.on('close', () => {
        if (ws.isAdmin) {
            sessionManager.removeAdmin(ws.adminId);
        } else if (ws.isAudience) {
            sessionManager.removeAudience(ws.clientId);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        ws.close();
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});

// Cleanup on server shutdown
process.on('SIGTERM', () => {
    wss.close(() => {
        server.close(() => {
            process.exit(0);
        });
    });
});