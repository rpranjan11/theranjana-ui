// src/ClientComponent.js
import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const ClientComponent = () => {
    const { messages } = useContext(AppContext);

    return (
        <div>
            <h1>Audience Plot</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {message.type === 'image' ? (
                            <img src={message.content} alt={`Message ${index + 1}`} />
                        ) : (
                            message.content
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientComponent;