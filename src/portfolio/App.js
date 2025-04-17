import './App.css';
import React from 'react';
import { Helmet } from 'react-helmet';
import HomePage from './pages/homePage/HomePage';
import ProjectsPage from './pages/projectsPage/ProjectsPage';
import CertificationsPage from './pages/certificationsPage/CertificationsPage';
import ExperiencesPage from "./pages/experiencesPage/ExperiencesPage";
import {BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { FirebaseProvider } from './firebase/userContext';

function App() {
    return (
        <>
            <Helmet>
                <title>Portfolio | TheRanjana</title>
            </Helmet>
            <FirebaseProvider>
                <BrowserRouter basename="/portfolio">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/experiences" element={<ExperiencesPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/certifications" element={<CertificationsPage />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                </BrowserRouter>
            </FirebaseProvider>
        </>
    );
}

export default App;