// src/llmchatbot/App.js
import React from 'react';
import "./scope.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { ChatPage } from './ChatPage';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
    return (
        <>
            <Helmet>
                <title>LLM Chatbot | TheRanjana</title>
            </Helmet>
            <div id="llm-chatbot-app">
                <Router>
                    <Routes>
                        <Route path="/llmchatbot" element={<ChatPage/>}/>
                    </Routes>
                </Router>
            </div>
        </>
    );
}

export default App;