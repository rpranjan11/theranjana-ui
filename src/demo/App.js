import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import AdminPage from './AdminPage';
import AudiencePage from './ClientPage';

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="/demo/admin" element={<AdminPage />} />
                    <Route path="/demo/audience" element={<AudiencePage />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;
