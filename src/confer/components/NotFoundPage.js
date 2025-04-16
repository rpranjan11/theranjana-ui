// src/confer/components/NotFoundPage.js
import React from 'react';
import './NotFoundPage.css';

const NotFoundPage = () => {
    const goToHomePage = () => {
        window.location.href = '/';
    };

    return (
        <div className="not-found">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <button onClick={goToHomePage} className="return-link">
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;