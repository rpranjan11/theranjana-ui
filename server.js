// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let messages = [];

wss.on('connection', (ws) => {
    // Send existing messages to the newly connected client
    ws.send(JSON.stringify({ type: 'initial', data: messages }));

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'newMessage') {
            messages.push(parsedMessage.data);
            // Broadcast the new message to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'newMessage', data: parsedMessage.data }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});