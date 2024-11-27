import React, { useContext } from 'react';
import { AppContext } from './AppContext';

const AdminComponent = () => {
    const { messages, pushNextMessage } = useContext(AppContext);

    return (
        <div>
            <h1>Admin Page</h1>
            <button onClick={pushNextMessage}>Push New Message</button>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminComponent;