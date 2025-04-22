import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import { FirebaseProvider } from './firebase/userContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <FirebaseProvider>
                <App />
            </FirebaseProvider>
        </ErrorBoundary>
    </React.StrictMode>
);

reportWebVitals();
