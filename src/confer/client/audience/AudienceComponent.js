// src/confer/audience/AudienceComponent.js
import React, { useContext } from 'react';
import { AppContext } from '../../AppContext';
import DOMPurify from 'dompurify';
import './AudienceComponent.css';
import ConnectionStatusIndicator from '../../components/ConnectionStatusIndicator';

const MessageItem = ({ message }) => {
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
        <div className={`message-item ${message.type === 'image' ? 'message-item--image' : 'message-item--text'}`}>
            {message.type === 'image' ? (
                <img
                    src={message.content}
                    alt="Presentation slide"
                    className="message-image"
                />
            ) : message.content === 'ThankYou | 감사합니다' ? (
                <span className="thank-you-message">{message.content}</span>
            ) : (
                <span
                    dangerouslySetInnerHTML={{
                        __html: sanitizeContent(message.content)
                    }}
                />
            )}
        </div>
    );
};

const ClientComponent = () => {
    const { messages, connectionStatus } = useContext(AppContext);

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
        <div>
            <h1 className="page-title">Audience Plot</h1>

            {/* Connection Status Indicator */}
            <ConnectionStatusIndicator
                status={connectionStatus.status}
                attemptCount={connectionStatus.attemptCount}
                error={connectionStatus.error}
            />

            {connectionStatus.status === 'connected' ? (
                <div className="message-container">
                    {messages.map((message, index) => (
                        <MessageItem key={index} message={message} />
                    ))}
                </div>
            ) : (
                <div className="connection-status-message">
                    {connectionStatus.status === 'failed' ? (
                        <div className="error-state">
                            <p>Unable to connect to the presentation server.</p>
                            <p>Please check your internet connection and try again.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="refresh-button"
                            >
                                Refresh Page
                            </button>
                        </div>
                    ) : (
                        <div className="connecting-state">
                            <p>Connecting to presentation server...</p>
                            <div className="loading-spinner"></div>
                        </div>
                    )}
                </div>
            )}

            <ul className="message-list">
                {messages.map((message, index) => (
                    <li key={index} className={`message-item ${message.type === 'image' ? 'message-item--image' : 'message-item--text'}`}>
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
        </div>
    );
};

export default ClientComponent;