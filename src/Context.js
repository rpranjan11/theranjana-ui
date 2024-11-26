import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(
        parseInt(localStorage.getItem('currentMessageIndex')) || 0
    );

    const messages = [
        { type: 'text', content: 'Welcome to the group chat!' },
        { type: 'text', content: 'Here is the agenda for today.' },
        { type: 'image', content: 'https://via.placeholder.com/150' },
        { type: 'text', content: 'Discussion Point 1' },
        { type: 'image', content: 'https://via.placeholder.com/150/FF0000' },
        { type: 'text', content: 'Closing remarks' },
    ];

    const pushNextMessage = () => {
        if (currentMessageIndex < messages.length - 1) {
            const newIndex = currentMessageIndex + 1;
            setCurrentMessageIndex(newIndex);
            localStorage.setItem('currentMessageIndex', newIndex); // Save to localStorage
        }
    };

    useEffect(() => {
        console.log('Context currentMessageIndex updated:', currentMessageIndex);
        localStorage.setItem('currentMessageIndex', currentMessageIndex);
    }, [currentMessageIndex]);

    return (
        <AppContext.Provider value={{ currentMessageIndex, messages, pushNextMessage }}>
            {children}
        </AppContext.Provider>
    );
};
