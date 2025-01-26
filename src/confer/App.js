// src/confer/App.js
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { WebSocketProvider } from './client/shared/WebSocketContext';
import AdminPage from './client/admin/AdminPage';
import AudiencePage from './client/audience/AudiencePage';
import NotFoundPage from './components/NotFoundPage';
import './App.css';
import './client/shared/responsive.css';

function ConferApp() {
    // Extract the base path from the current URL
    const basePath = '/confer';

    return (
        <ErrorBoundary>
            <WebSocketProvider>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route
                            path={`${basePath}/client/admin/*`}
                            element={<AdminPage />}
                        />
                        <Route
                            path={`${basePath}/client/audience/*`}
                            element={<AudiencePage />}
                        />
                        <Route
                            path={`${basePath}`}
                            element={<Navigate to={`${basePath}/client/audience`} replace />}
                        />
                        <Route
                            path="*"
                            element={<NotFoundPage />}
                        />
                    </Routes>
                </Suspense>
            </WebSocketProvider>
        </ErrorBoundary>
    );
}

export default ConferApp;