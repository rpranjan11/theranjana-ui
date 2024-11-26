import React, { useContext } from 'react';
import { AppContext } from './Context';

const AdminPage = () => {
    const { currentMessageIndex, messages, pushNextMessage } = useContext(AppContext);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Group Chat (Admin View)</h1>
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
            <button
                onClick={pushNextMessage}
                style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
            >
                Push Next Message
            </button>
        </div>
    );
};

export default AdminPage;
