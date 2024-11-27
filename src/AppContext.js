// src/AppContext.js
import React, { createContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children, isAdmin }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const socketRef = useRef(null);

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
                        message.data
                    ]);
                } else if (message.type === 'deleteMessage') {
                    setMessages((prevMessages) => prevMessages.slice(0, -1));
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

    const pushNextMessage = () => {
        if (!isAdmin) return;

        const predefinedMessages = [
            { type: 'text', content: 'Welcome to the group chat!' },
            { type: 'text', content: 'Here is the agenda for today.' },
            { type: 'image', content: 'https://www.google.com/imgres?q=images%20jpg&imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-photo%2Fanimal-eye-staring-close-up-watch-nature-generative-ai_188544-15471.jpg&imgrefurl=https%3A%2F%2Fkr.freepik.com%2Ffree-photos-vectors%2Fjpg&docid=zdr8gH-F6R-mwM&tbnid=rHWomAg7aKxleM&vet=12ahUKEwiU7p7txfuJAxWCb_UHHZkjPIsQM3oECBYQAA..i&w=626&h=358&hcb=2&ved=2ahUKEwiU7p7txfuJAxWCb_UHHZkjPIsQM3oECBYQAA' },
            { type: 'text', content: 'Discussion Point 1' },
            { type: 'image', content: 'https://via.placeholder.com/150/FF0000' },
            { type: 'text', content: 'Closing remarks' },
        ];

        if (currentMessageIndex < predefinedMessages.length) {
            const nextMessage = predefinedMessages[currentMessageIndex];
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ type: 'newMessage', data: nextMessage }));
                setMessages((prevMessages) => [
                    ...prevMessages,
                    nextMessage
                ]);
                setCurrentMessageIndex(currentMessageIndex + 1);
            } else {
                console.error('WebSocket is not open');
            }
        }
    };

    const deleteLastMessage = () => {
        if (!isAdmin || messages.length === 0) return;

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'deleteMessage' }));
            setMessages((prevMessages) => prevMessages.slice(0, -1));
            setCurrentMessageIndex(currentMessageIndex - 1);
        } else {
            console.error('WebSocket is not open');
        }
    };

    return (
        <AppContext.Provider value={{ messages, pushNextMessage, deleteLastMessage }}>
            {children}
        </AppContext.Provider>
    );
};