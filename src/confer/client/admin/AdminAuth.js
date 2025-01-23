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

        // Get the admin credential from environment variable
        const adminCredential = process.env.REACT_APP_CONFER_ADMIN_CREDENTIAL;

        if (!adminCredential) {
            setError('Admin credentials are not configured');
            return;
        }

        // Verify the credentials
        if (credentials === adminCredential) {
            onAuth(credentials);
        } else {
            setError('Invalid credentials');
            setCredentials(''); // Clear the input on wrong attempt
        }
    };

    const handleInputChange = (e) => {
        setCredentials(e.target.value);
        setError(''); // Clear error when user starts typing
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
                            onChange={handleInputChange}
                            placeholder="Enter admin credentials"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;