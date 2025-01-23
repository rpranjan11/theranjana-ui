// src/confer/client/admin/AdminAuth.js
import React, { useState } from 'react';
import './AdminAuth.css';

const AdminAuth = ({ onAuth }) => {
    const [credentials, setCredentials] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!credentials.trim()) {
            setError('Please enter credentials');
            return;
        }
        onAuth(credentials);
    };

    return (
        <div className="admin-auth">
            <div className="auth-container">
                <form onSubmit={handleSubmit}>
                    <h2>Admin Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    <div className="input-group">
                        <input
                            type="password"
                            value={credentials}
                            onChange={(e) => setCredentials(e.target.value)}
                            placeholder="Enter admin credentials"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;