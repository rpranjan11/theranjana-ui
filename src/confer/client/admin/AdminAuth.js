// src/confer/client/admin/AdminAuth.js
import React, { useState, useRef, useEffect } from 'react';
import './AdminAuth.css';

const AdminAuth = ({ onAuth }) => {
    const [credentials, setCredentials] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus the input element when component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []); // Empty dependency array means this runs once on mount

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
            // Store credentials in sessionStorage before calling onAuth
            sessionStorage.setItem('admin_credentials', credentials);
            console.log('Admin credentials stored in session storage'); // Debug log
            onAuth(credentials);
        } else {
            setError('Invalid credentials');
            setCredentials(''); // Clear the input on wrong attempt
            // Re-focus the input after invalid attempt
            inputRef.current?.focus();
        }
    };

    const handleInputChange = (e) => {
        setCredentials(e.target.value);
        setError(''); // Clear error when user starts typing
    };

    return (
        <div className="admin-auth">
            <div className="admin-auth-container">
                <form onSubmit={handleSubmit}>
                    <h2>Admin Login</h2>
                    {error && <div className="admin-error-message">{error}</div>}
                    <div className="admin-input-group">
                        <input
                            ref={inputRef}
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