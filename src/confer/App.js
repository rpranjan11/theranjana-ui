import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import AdminPage from './admin/AdminPage';
import AudiencePage from './audience/AudiencePage';

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="confer/admin" element={<AdminPage />} />
                    <Route path="confer/audience" element={<AudiencePage />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;
