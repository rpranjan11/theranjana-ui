// src/AudienceComponent.js
import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const ClientComponent = () => {
    const { messages } = useContext(AppContext);

    return (
        <div>
            <h1 style={{color: 'blue', fontSize: '3em', textAlign: 'center'}}>Audience Plot</h1>
            <ul style={{listStyleType: 'none', padding: 20}}>
                {messages.map((message, index) => (
                    <li key={index} style={{
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        padding: '10px',
                        margin: '10px 0',
                        backgroundColor: message.type === 'image' ? '#f9f9f9' : '#e0f7fa'
                    }}>
                        {message.type === 'image' ? (
                            <img src={message.content} alt={`Message ${index + 1}`} style={{maxWidth: '100%'}}/>
                        ) : (message.content === 'ThankYou | 감사합니다' ? (
                                    <span style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '1.5em'
                                    }}>{message.content}</span>
                                ) :
                                message.content
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientComponent;