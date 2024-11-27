// src/LoginPopup.js
import React, { useState } from 'react';

const LoginPopup = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        const admin = process.env.REACT_APP_ADMIN_USERNAME;
        const pass = process.env.REACT_APP_ADMIN_PASS;
        console.log(admin, pass);
        if (username === admin && password === pass) {
            onLogin(true);
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
            }}>
                <h2>Admin Login</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div>
                    <label>
                        Username : &nbsp;
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password : &nbsp;&nbsp;
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: 10}} onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin();
                }} tabIndex="0">
                    <button onClick={handleLogin} style={{fontSize: '1.2em', backgroundColor: 'green', color: 'white'}}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;