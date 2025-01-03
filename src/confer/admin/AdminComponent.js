// src/AdminComponent.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';

const AdminComponent = () => {
    const { messages, pushNextMessage, deleteLastMessage } = useContext(AppContext);
    const { setPredefinedMessagesFile } = useContext(AppContext);
    const [selectedFile, setSelectedFile] = useState('');
    const { setMessages } = useContext(AppContext);
    const { setCurrentMessageIndex } = useContext(AppContext);

    const handleSelectionChange = (event) => {
        const selectedFile = event.target.value;
        setSelectedFile(selectedFile);
        setPredefinedMessagesFile(selectedFile);
        setMessages([]); // Clear the messages
        setCurrentMessageIndex(0); // Reset the current message index
    };

    return (
        <div>
            <h1 style={{color: 'blue', fontSize: '3em', textAlign: 'center'}}>Presentation Owner</h1>
            <div style={{color: 'darkolivegreen', textAlign: 'center'}}>
                <label htmlFor="messageFileSelector">Select Predefined Messages File:</label>
                <select id="messageFileSelector" value={selectedFile} onChange={handleSelectionChange}>
                    <option value="">Select the Confer topic</option>
                    <option value="social_customs">Social Customs</option>
                    <option value="geographic_diversity_of_india">Geographic Diversity of India</option>
                </select>
            </div>
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
                            ) : (
                                <span
                                    dangerouslySetInnerHTML={{__html: message.content.replace(/<=>/g, '<br/><span style="display: block; text-align: -webkit-left; color: red; font-weight: bold;">&lt;=&gt;</span>')}}/>
                            )
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
                        style={{
                            color: 'white',
                            backgroundColor: 'red',
                            fontSize: '1em',
                            padding: '10px',
                            borderRadius: '3px'
                        }}>Delete Last
                    Message
                </button>
            </div>
        </div>
    );
};

export default AdminComponent;