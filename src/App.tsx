import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={SignupPage} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/manage-students" component={StudentManagement} />
            </Switch>
        </Router>
    );
};

export default App;