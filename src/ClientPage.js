import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './Context';

const ClientPage = () => {
    const { messages } = useContext(AppContext);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(
        parseInt(localStorage.getItem('currentMessageIndex')) || 0
    );

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'currentMessageIndex') {
                setCurrentMessageIndex(parseInt(event.newValue));
                console.log('ClientPage updated currentMessageIndex:', event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Group Chat (Client View)</h1>
            <div>
                {messages.slice(0, currentMessageIndex + 1).map((msg, idx) => (
                    <div key={idx} style={{ margin: '10px 0' }}>
                        {msg.type === 'text' ? (
                            <p>{msg.content}</p>
                        ) : (
                            <img src={msg.content} alt="Message Content" style={{ maxWidth: '200px' }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientPage;
