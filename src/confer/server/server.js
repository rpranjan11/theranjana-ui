// src/confer/server/server.js
const WebSocket = require('ws');
const http = require('http');
const sessionManager = require('./sessionManager');
const messageStore = require('./messageStore');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    });
    res.end(JSON.stringify({ status: 'Server is running' }));
});

const wss = new WebSocket.Server({
    server,
    perMessageDeflate: false,
    clientTracking: true,
    handleProtocols: (protocols) => {
        // Accept any protocol or 'confer-protocol' specifically
        return protocols && protocols.includes('confer-protocol')
            ? 'confer-protocol'
            : protocols ? protocols[0] : undefined;
    }
});

// Add this helper function for admin message handling
const handleAdminMessage = (ws, message, adminId) => {
    console.log('Handling admin message:', message.type);
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

            case 'topic_update':
                console.log('Processing topic update:', message.topic);
                sessionManager.setCurrentTopic(message.topic);
                // Notify all audience members
                sessionManager.notifyAudiences({
                    type: 'topic_update',
                    topic: message.topic,
                    timestamp: new Date().toISOString()
                });
                // Clear messages for new topic
                messageStore.clearMessages(adminId);
                sessionManager.notifyAudiences({
                    type: 'clear_messages'
                });
                // Send confirmation to admin
                ws.send(JSON.stringify({
                    type: 'topic_update_confirmed',
                    topic: message.topic
                }));
                break;

            case 'heartbeat':
                sessionManager.updateAdminActivity();
                ws.send(JSON.stringify({
                    type: 'heartbeat_ack',
                    timestamp: new Date().toISOString()
                }));
                break;

            default:
                console.log('Unknown admin message type:', message.type);
        }
    } catch (error) {
        console.error('Error handling admin message:', error);
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to process admin message'
        }));
    }
};

wss.on('connection', (ws, req) => {
    console.log('New connection established from:', req.socket.remoteAddress);

    // Add immediate response for connection acknowledgment
    ws.send(JSON.stringify({
        type: 'connection_established',
        timestamp: new Date().toISOString()
    }));

    // Enhance the message handling
    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received message type:', message.type);

            switch (message.type) {
                case 'admin_auth':
                    console.log('Processing admin authentication...');
                    const authResult = sessionManager.setAdmin(ws, message.credentials);
                    console.log('Auth result:', authResult);

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

                        // Send immediate auth success response
                        ws.send(JSON.stringify({
                            type: 'auth_response',
                            status: 'success',
                            adminId,
                            currentTopic: sessionManager.getCurrentTopic()
                        }));

                        // Broadcast admin connection to all clients
                        sessionManager.notifyAudiences({
                            type: 'admin_connected',
                            timestamp: new Date().toISOString()
                        });
                    }
                    break;

                case 'extend_session':
                    if (ws.isAdmin) {
                        console.log('Processing session extension request...');
                        const extended = sessionManager.extendAdminSession();
                        ws.send(JSON.stringify({
                            type: 'session_extended',
                            success: extended,
                            timestamp: new Date().toISOString()
                        }));
                    }
                    break;

                case 'heartbeat':
                    if (ws.isAdmin) {
                        sessionManager.updateAdminActivity();
                        ws.send(JSON.stringify({ type: 'heartbeat_ack' }));
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
                        const currentTopic = sessionManager.getCurrentTopic();
                        console.log('Sending initial state to audience:', {
                            adminId,
                            messages,
                            currentTopic
                        });
                        ws.send(JSON.stringify({
                            type: 'initial_state',
                            adminId,
                            messages,
                            currentTopic
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

                case 'clear_messages':
                    if (ws.isAdmin) {
                        // Clear messages for this admin
                        messageStore.clearMessages(ws.adminId);

                        // Notify all audience members
                        sessionManager.notifyAudiences({
                            type: 'clear_messages',
                            adminId: ws.adminId
                        });
                    }
                    break;

                case 'admin_logout':
                    if (ws.isAdmin) {
                        // Remove admin session
                        sessionManager.removeAdmin(ws.adminId);

                        // Send confirmation to the admin client
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({
                                type: 'logout_success'
                            }));
                        }

                        // Clear the admin flags
                        ws.isAdmin = false;
                        ws.adminId = null;
                    }
                    break;

                case 'topic_update':
                    if (ws.isAdmin) {
                        console.log('Admin updating topic:', message.topic);
                        sessionManager.setCurrentTopic(message.topic);
                        // Send the update to all audience members
                        sessionManager.notifyAudiences({
                            type: 'topic_update',
                            topic: message.topic
                        });
                        // Clear messages when topic changes
                        messageStore.clearMessages(ws.adminId);
                        sessionManager.notifyAudiences({
                            type: 'clear_messages'
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
                message: 'Error processing message: ' + error.message
            }));
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        // Notify client of the error
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'WebSocket error occurred'
            }));
        }
        ws.close();
    });

    // Enhanced close handling
    ws.on('close', (code, reason) => {
        console.log(`Connection closed with code ${code} and reason: ${reason}`);
        if (ws.isAdmin) {
            console.log('Admin connection closed, cleaning up session...');
            sessionManager.removeAdmin(ws.adminId);
        } else if (ws.isAudience) {
            console.log('Audience connection closed, cleaning up...');
            sessionManager.removeAudience(ws.clientId);
        }
    });
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

server.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
    console.log(`WebSocket server is ready to accept connections`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Cleanup on server shutdown
process.on('SIGTERM', () => {
    wss.close(() => {
        server.close(() => {
            process.exit(0);
        });
    });
});