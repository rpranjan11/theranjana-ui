// src/AdminComponent.js
import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const AdminComponent = () => {
    const { messages, pushNextMessage, deleteLastMessage } = useContext(AppContext);

    return (
        <div>
            <h1>Presentation Owner</h1>
            <button onClick={pushNextMessage}>Push New Message</button>
            <button onClick={deleteLastMessage}>Delete Last Message</button>
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

export default AdminComponent;