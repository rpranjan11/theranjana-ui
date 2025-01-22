// src/confer/admin/AdminComponent.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContext';
import DOMPurify from 'dompurify';
import './AdminComponent.css';
import ConnectionStatusIndicator from '../../components/ConnectionStatusIndicator';

const MessageList = ({ messages }) => {
    const sanitizeContent = (content) => {
        const replacedContent = content.replace(
            /<=>/g,
            '<br/><span class="separator"><=></span>'
        );
        return DOMPurify.sanitize(replacedContent, {
            ALLOWED_TAGS: ['br', 'span'],
            ALLOWED_ATTR: ['class']
        });
    };

    return (
        <ul className="message-list">
            {messages.map((message, index) => (
                <li key={index} className={`message-item ${message.type === 'image' ? 'image-message' : 'text-message'}`}>
                    {message.type === 'image' ? (
                        <img
                            src={message.content}
                            alt={`Presentation slide ${index + 1}`}
                            className="message-image"
                        />
                    ) : (message.content === 'ThankYou | 감사합니다' ? (
                        <span className="thank-you-message">{message.content}</span>
                    ) : (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: sanitizeContent(message.content)
                            }}
                        />
                    ))}
                </li>
            ))}
        </ul>
    );
};

const AdminComponent = () => {
    const { messages, pushNextMessage, deleteLastMessage, connectionStatus } = useContext(AppContext);
    const { setPredefinedMessagesFile } = useContext(AppContext);
    const [selectedFile, setSelectedFile] = useState('');
    const { setMessages } = useContext(AppContext);
    const { setCurrentMessageIndex } = useContext(AppContext);

    const sanitizeContent = (content) => {
        const replacedContent = content.replace(
            /<=>/g,
            '<br/><span class="separator"><=></span>'
        );
        return DOMPurify.sanitize(replacedContent, {
            ALLOWED_TAGS: ['br', 'span'],
            ALLOWED_ATTR: ['class']
        });
    };

    const handleSelectionChange = (event) => {
        const selectedFile = event.target.value;
        setSelectedFile(selectedFile);
        setPredefinedMessagesFile(selectedFile);
        setMessages([]); // Clear the messages
        setCurrentMessageIndex(0); // Reset the current message index
    };

    return (
        <div>
            <ConnectionStatusIndicator
                status={connectionStatus.status}
                attemptCount={connectionStatus.attemptCount}
                error={connectionStatus.error}
            />

            <h1 className="admin-heading">Presentation Owner</h1>
            <div className="selector-container">
                <label htmlFor="messageFileSelector" aria-label="Select presentation topic">
                    Select Predefined Messages File:
                </label>
                <select
                    id="messageFileSelector"
                    value={selectedFile}
                    onChange={handleSelectionChange}
                    disabled={connectionStatus.status !== 'connected'}
                    aria-disabled={connectionStatus.status !== 'connected'}
                >
                    <option value="">Select the Confer topic</option>
                    <option value="social_customs">Social Customs</option>
                    <option value="geographic_diversity_of_india">Geographic Diversity of India</option>
                </select>
            </div>
            <ul className="admin-message-list">
                {messages.map((message, index) => (
                    <li key={index} className={`admin-message-item ${message.type === 'image' ? 'image-message' : 'text-message'}`}>
                        {message.type === 'image' ? (
                            <img
                                src={message.content}
                                alt={`Presentation slide ${index + 1}`}
                                className="message-image"
                            />
                        ) : (message.content === 'ThankYou | 감사합니다' ? (
                            <span className="thank-you-message">{message.content}</span>
                        ) : (
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeContent(message.content)
                                }}
                            />
                        ))}
                    </li>
                ))}
            </ul>
            <div className="button-container">
                <button
                    onClick={pushNextMessage}
                    disabled={connectionStatus.status !== 'connected'}
                    className={`push-button ${connectionStatus.status !== 'connected' ? 'disabled' : ''}`}
                >
                    Push New Message
                </button>
                <button
                    onClick={deleteLastMessage}
                    disabled={connectionStatus.status !== 'connected'}
                    className={`delete-button ${connectionStatus.status !== 'connected' ? 'disabled' : ''}`}
                >
                    Delete Last Message
                </button>
            </div>
            {/* Message display section */}
            {connectionStatus.status === 'connected' ? (
                <MessageList messages={messages} />
            ) : (
                <div className="connection-warning">
                    {connectionStatus.status === 'failed' ? (
                        <p>Connection failed. Please try refreshing the page.</p>
                    ) : (
                        <p>Establishing connection to server...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminComponent;