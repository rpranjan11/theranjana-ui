// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ConferApp from './confer/App';
import DemoApp from './demo/App';
import LLMChatbot from './llmchatbot/App';
import Portfolio from './portfolio/App';
import HomePage from './HomePage';

const App = () => {
    const path = window.location.pathname;

    // Return specific app based on path
    if (path.startsWith('/confer')) {
        return (
            <Router>
                <ConferApp />
            </Router>
        );
    } else if (path.startsWith('/demo')) {
        return <DemoApp />;
    } else if (path.startsWith('/llmchatbot')) {
        return <LLMChatbot />;
    } else if (path.startsWith('/portfolio')) {
        return <Portfolio />;
    } else {
        return <HomePage />;
    }
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);