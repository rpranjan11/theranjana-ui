// src/confer/client/audience/MessageDisplay.js
import React, { useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from '../shared/WebSocketContext';
import './MessageDisplay.css';

const MessageDisplay = () => {
    const { connectionStatus, sendMessage, messages, adminSession } = useWebSocket();
    const adminActive = connectionStatus.status === 'connected' && adminSession !== null;
    const messageListRef = useRef(null);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        if (messageListRef.current) {
            const scrollHeight = messageListRef.current.scrollHeight;
            const height = messageListRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            messageListRef.current.scrollTo({
                top: maxScrollTop > 0 ? maxScrollTop : 0,
                behavior
            });
        }
    }, []);

    // Auto-scroll effect - enhanced version
    useEffect(() => {
        if (messages.length > 0) {
            // Initial load - instant scroll
            scrollToBottom('auto');

            // Additional scroll after a short delay to ensure images are loaded
            const timeoutId = setTimeout(() => {
                scrollToBottom('auto');
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [messages, scrollToBottom]);

    // Add scroll to bottom when images load
    const handleImageLoad = useCallback(() => {
        scrollToBottom('auto');
    }, [scrollToBottom]);

    // Initial connection effect
    useEffect(() => {
        if (connectionStatus.status === 'connected') {
            console.log('Sending initial audience_connect message');
            sendMessage({
                type: 'audience_connect'
            });
        }
    }, [connectionStatus.status, sendMessage]);

    // Auto-scroll effect
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';

        return date.toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="audience-message-display">
            <div
                className={`audience-message-list ${!adminActive || messages.length === 0 ? 'empty' : ''}`}
                ref={messageListRef}
            >
                {(!adminActive) && (
                    <div className="audience-no-admin-notice">
                        <h2>Waiting for Conference</h2>
                        <p>There is no active conference at the moment.</p>
                        <p>The page will automatically update when a conference begins.</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div key={`${message.timestamp}-${index}`} className="audience-message-item">
                        {message.type === 'image' ? (
                            <div className="audience-image-container">
                                <img
                                    src={message.content}
                                    alt={`Slide ${index + 1}`}
                                    loading="lazy"
                                    onLoad={handleImageLoad}  // Add onLoad handler for images
                                />
                            </div>
                        ) : (
                            <div className="audience-text-container">
                                <p>{message.content === "ThankYou | 감사합니다" ?
                                    <span style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.5em'
                                    }}>
                                    {message.content}
                                    </span>
                                    :
                                    message.content.includes("<=>") ?
                                    <>
                                      {message.content.split("<=>")[0]}
                                      <div style={{
                                        color: '#1a73e8',
                                        textAlign: 'start',
                                        fontWeight: 'bold',
                                        fontSize: '1em'
                                      }}>&lt;=&gt;</div>
                                      {message.content.split("<=>")[1]}
                                    </>
                                    :
                                    message.content}
                                </p>
                            </div>
                        )}
                        <span className="audience-message-timestamp">
                            {message.timestamp && formatTimestamp(message.timestamp)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageDisplay;