import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import AdminPage from './AdminPage';
import AudiencePage from './ClientPage';

function App() {
    return (
        <>
            <Helmet>
                <title>Demo App | TheRanjana</title>
            </Helmet>
            <AppProvider>
                <Router>
                    <Routes>
                        <Route path="/demo/admin" element={<AdminPage />} />
                        <Route path="/demo/audience" element={<AudiencePage />} />
                    </Routes>
                </Router>
            </AppProvider>
        </>
    );
}

export default App;
