// src/HomePage.js
import React from 'react';
import './HomePage.css';

const HomePage = () => {
    // App data structure to easily manage and add future apps
    const apps = [
        {
            id: 'portfolio',
            name: 'Portfolio',
            path: '/portfolio',
            category: 'standalone',
            color: '#4285F4',
        },
        {
            id: 'llmchatbot',
            name: 'LLM Chatbot',
            path: '/llmchatbot',
            category: 'standalone',
            color: '#34A853',
        },
        {
            id: 'confer-admin',
            name: 'Confer : Admin',
            path: '/confer/profile/admin',
            category: 'confer',
            color: '#EA4335',
        },
        {
            id: 'confer-audience',
            name: 'Confer : Audience',
            path: '/confer/profile/audience',
            category: 'confer',
            color: '#FBBC05',
        },
        {
            id: 'demo-admin',
            name: 'Demo : Admin',
            path: '/demo/admin',
            category: 'demo',
            color: '#8956FF',
        },
        {
            id: 'demo-audience',
            name: 'Demo : Audience',
            path: '/demo/audience',
            category: 'demo',
            color: '#FF56A9',
        },
    ];

    // Group apps by category
    const categorizedApps = apps.reduce((acc, app) => {
        if (!acc[app.category]) {
            acc[app.category] = [];
        }
        acc[app.category].push(app);
        return acc;
    }, {});

    const handleAppClick = (path) => {
        window.location.href = path;
    };

    return (
        <div className="app-store-container">
            <div className="animated-background"></div>

            <header className="app-store-header">
                <h1>TheRanjana App Store</h1>
            </header>

            <main className="app-store-content">
                {/* Standalone Apps */}
                <div className="app-category standalone-apps">
                    {categorizedApps.standalone.map(app => (
                        <div
                            key={app.id}
                            className="app-card standalone"
                            style={{ '--app-color': app.color }}
                            onClick={() => handleAppClick(app.path)}
                        >
                            <div className="app-logo-container">
                                {/* Will be replaced with an actual logo image in the future */}
                                <div className="app-icon">{app.name.charAt(0)}</div>
                            </div>
                            <div className="app-name">{app.name}</div>
                        </div>
                    ))}
                </div>

                {/* Connected Apps (Confer) */}
                <div className="app-category connected-apps">
                    <div className="category-label">Confer</div>
                    <div className="connected-apps-container">
                        {categorizedApps.confer.map(app => (
                            <div
                                key={app.id}
                                className="app-card connected"
                                style={{ '--app-color': app.color }}
                                onClick={() => handleAppClick(app.path)}
                            >
                                <div className="app-logo-container">
                                    {/* Will be replaced with an actual logo image in the future */}
                                    <div className="app-icon">{app.name.split(':')[1]?.trim().charAt(0) || app.name.charAt(0)}</div>
                                </div>
                                <div className="app-name">{app.name}</div>
                            </div>
                        ))}
                        <div className="connection-line"></div>
                    </div>
                </div>

                {/* Connected Apps (Demo) */}
                <div className="app-category connected-apps">
                    <div className="category-label">Demo</div>
                    <div className="connected-apps-container">
                        {categorizedApps.demo.map(app => (
                            <div
                                key={app.id}
                                className="app-card connected"
                                style={{ '--app-color': app.color }}
                                onClick={() => handleAppClick(app.path)}
                            >
                                <div className="app-logo-container">
                                    {/* Will be replaced with an actual logo image in the future */}
                                    <div className="app-icon">{app.name.split(':')[1]?.trim().charAt(0) || app.name.charAt(0)}</div>
                                </div>
                                <div className="app-name">{app.name}</div>
                            </div>
                        ))}
                        <div className="connection-line"></div>
                    </div>
                </div>
            </main>

            <footer className="app-store-footer">
                <p>Gonna introduce more apps soon</p>
            </footer>
        </div>
    );
};

export default HomePage;