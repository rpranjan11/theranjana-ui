// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import ConferApp from './confer/App';
import DemoApp from './demo/App';
import LLMChatbot from './llmchatbot/App';

const App = () => {
    const path = window.location.pathname;
    if (path.startsWith('/confer')) {
        return <ConferApp />;
    } else if (path.startsWith('/demo')) {
        return <DemoApp />;
    } else if (path.startsWith('/llmchatbot')) {
        return <LLMChatbot />;
    } else {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
                justifyContent: 'center'
            }}>
                <button style={{width: '300px', margin: '15px', padding: '10px'}}
                        onClick={() => window.location.href = '/confer/admin'}>Confer : Admin
                </button>
                <button style={{width: '300px', margin: '15px', padding: '10px'}}
                        onClick={() => window.location.href = '/confer/audience'}>Confer : Audience
                </button>
                <button style={{width: '300px', margin: '15px', padding: '10px'}}
                        onClick={() => window.location.href = '/llmchatbot'}>LLM Chatbot
                </button>
                <button style={{width: '300px', margin: '15px', padding: '10px'}}
                        onClick={() => window.location.href = '/demo/admin'}>Demo : Admin
                </button>
                <button style={{width: '300px', margin: '15px', padding: '10px'}}
                        onClick={() => window.location.href = '/demo/audience'}>Demo : Audience
                </button>
            </div>
        );
    }
};

ReactDOM.render(<App/>, document.getElementById('root'));