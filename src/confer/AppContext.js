// src/AppContext.js
import React, { createContext, useState, useEffect, useRef } from 'react';
// import predefinedMessages from './social_customs/data/predefinedMessages';
// import predefinedMessages from './geographic_diversity_of_india/data/predefinedMessages';

export const AppContext = createContext();

export const AppProvider = ({ children, isAdmin }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [predefinedMessages, setPredefinedMessages] = useState([]);
    const socketRef = useRef(null);

    const setPredefinedMessagesFile = async (fileName) => {
        try {
            const module = await import(`./${fileName}/data/predefinedMessages`);
            setPredefinedMessages(module.default);
        } catch (error) {
            console.error('Error loading predefined messages file:', error);
        }
    };

    useEffect(() => {
        const socket = new WebSocket(process.env.REACT_APP_CONFER_API_WS_URL);
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
        <AppContext.Provider value={{ messages, setMessages,  currentMessageIndex, setCurrentMessageIndex, pushNextMessage, deleteLastMessage, setPredefinedMessagesFile }}>
            {children}
        </AppContext.Provider>
    );
};
