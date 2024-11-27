// src/ClientComponent.js
import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const ClientComponent = () => {
    const { messages } = useContext(AppContext);

    return (
        <div>
            <h1>Client Page</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        {message.content.startsWith('/static/images/') ? (
                            <img src={message.content} alt={`Message ${index}`} />
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