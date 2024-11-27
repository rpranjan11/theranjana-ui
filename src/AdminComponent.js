// src/AdminComponent.js
import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const AdminComponent = () => {
    const { messages, pushNextMessage, deleteLastMessage } = useContext(AppContext);

    return (
        <div>
            <h1 style={{color: 'blue', fontSize: '3em', textAlign: 'center'}}>Presentation Owner</h1>
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
                        ) : (
                            message.content
                        )}
                    </li>
                ))}
            </ul>
            <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                <button onClick={pushNextMessage}
                        style={{
                            color: 'white',
                            backgroundColor: 'green',
                            marginRight: '10px',
                            fontSize: '1em',
                            padding: '10px',
                            borderRadius: '3px'
                        }}>Push New Message
                </button>
                <button onClick={deleteLastMessage}
                        style={{color: 'white', backgroundColor: 'red', fontSize: '1em', padding: '10px', borderRadius: '3px'}}>Delete Last
                    Message
                </button>
            </div>
        </div>
    );
};

export default AdminComponent;