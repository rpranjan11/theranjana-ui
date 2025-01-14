// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import ConferApp from './confer/App';
import DemoApp from './demo/App';
import LLMChatbot from './llmchatbot/App';

const App = () => {
    const path = window.location.pathname;

    // Determine title based on path
    let title = "";  // default title
    if (path.startsWith('/confer')) {
        title = "Confer";
    } else if (path.startsWith('/demo')) {
        title = "Demo App";
    } else if (path.startsWith('/llmchatbot')) {
        title = "LLM Chatbot";
    } else {
        title = "The Ranjana & Services";
    }

    // Always render Helmet with the appropriate title
    const helmet = (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={`${title} - The Ranjana & Services`} />
        </Helmet>
    );

    // Return appropriate component with helmet
    if (path.startsWith('/confer')) {
        return (
            <>
                {helmet}
                <ConferApp />
            </>
        );
    } else if (path.startsWith('/demo')) {
        return (
            <>
                {helmet}
                <DemoApp />
            </>
        );
    } else if (path.startsWith('/llmchatbot')) {
        return (
            <>
                {helmet}
                <LLMChatbot />
            </>
        );
    } else {
        return (
            <>
                {helmet}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100vh',
                    justifyContent: 'center'
                }}>
                    <button style={{width: '300px', margin: '15px', padding: '10px'}}
                            onClick={() => window.location.href = '/confer/socialcustoms'}>Confer : Social Customs
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
            </>
        );
    }
};

ReactDOM.render(<App/>, document.getElementById('root'));