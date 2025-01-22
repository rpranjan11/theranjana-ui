// src/confer/client/admin/AdminAuth.js
import React, { useState } from 'react';

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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Admin Login</h2>
                {error && (
                    <div style={{
                        color: '#dc3545',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={credentials}
                        onChange={(e) => setCredentials(e.target.value)}
                        placeholder="Enter admin credentials"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                        }}
                        required
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;