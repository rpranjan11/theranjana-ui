import './App.css';
import HomePage from './pages/homePage/HomePage';
import PapersPage from './pages/papersPage/PapersPage';
import PresentationsPage from './pages/presentationsPage/PresentationsPage';
import VideoPage from './pages/videoPage/VideoPage';
import {BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { FirebaseProvider } from './firebase/userContext';

function App() {
    return (
        <FirebaseProvider>
            <BrowserRouter basename="/portfolio">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/papers" element={<PapersPage />} />
                    <Route path="/presentations" element={<PresentationsPage />} />
                    <Route path="/videos" element={<VideoPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </BrowserRouter>
        </FirebaseProvider>
    );
}

export default App;