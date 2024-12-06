import React from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import { AppProvider } from './AppContext'; // Correct path to Context
import AdminPage from './AdminPage';
import ClientPage from './ClientPage';

function App() {
    return (
        <Router>
          <Switch>
            <Route path="/admin" component={AdminPage} />
            <Route path="/audience" component={ClientPage} />
          </Switch>
        </Router>
    );
}

export default App;
