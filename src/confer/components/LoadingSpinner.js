// src/confer/components/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <div className="spinner-wrapper">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;