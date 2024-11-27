// src/AppContext.js
import React, { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children, isAdmin }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const socketRef = useRef(null);

    // src/AppContext.js
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (event) => {
            const reader = new FileReader();
            reader.onload = () => {
                const message = JSON.parse(reader.result);
                if (message.type === 'initial') {
                    setMessages(message.data);
                } else if (message.type === 'newMessage') {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { type: 'text', content: message.data }
                    ]);
                }
            };
            reader.readAsText(event.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        socket.onclose = (event) => {
            if (event.wasClean) {
                console.log('Connection closed cleanly');
            } else {
                console.error('Connection died');
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    // src/AppContext.js
    const pushNextMessage = () => {
        if (!isAdmin) return;

        const predefinedMessages = [
            'Welcome to the group chat!',
            'Here is the agenda for today.',
            'https://via.placeholder.com/150',
            'Discussion Point 1',
            'https://via.placeholder.com/150/FF0000',
            'Closing remarks'
        ];

        if (currentMessageIndex < predefinedMessages.length) {
            const nextMessage = predefinedMessages[currentMessageIndex];
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ type: 'newMessage', data: nextMessage }));
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'text', content: nextMessage }
                ]);
                setCurrentMessageIndex(currentMessageIndex + 1);
            } else {
                console.error('WebSocket is not open');
            }
        }
    };

    return (
        <AppContext.Provider value={{ messages, pushNextMessage }}>
            {children}
        </AppContext.Provider>
    );
};