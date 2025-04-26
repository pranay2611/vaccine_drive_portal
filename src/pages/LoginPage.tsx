import React from 'react';
import Login from '../components/Login';

const LoginPage: React.FC = () => {
    return (
        <div className="login-page">
            <h1>Login</h1>
            <Login />
        </div>
    );
};

export default LoginPage;