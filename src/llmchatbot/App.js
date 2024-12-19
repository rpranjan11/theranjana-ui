import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChatPage } from './ChatPage';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/llmchatbot" element={<ChatPage />} />
        </Routes>
    </Router>
  );
}

export default App;
