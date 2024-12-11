import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './social_customs/AppContext';
import AdminPage from './social_customs/AdminPage';
import AudiencePage from './audience/AudiencePage';

function App() {
    return (
        <AppProvider>
            <Router>
                <Routes>
                    <Route path="confer/socialcustoms" element={<AdminPage />} />
                    <Route path="confer/audience" element={<AudiencePage />} />
                </Routes>
            </Router>
        </AppProvider>
    );
}

export default App;
