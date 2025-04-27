import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';
import '../styles/Auth.css';

const Auth: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup'); // Manage active tab

    return (
        <div className="auth-container">
            <div className="tab-header">
                <button
                    className={activeTab === 'signup' ? 'active' : ''}
                    onClick={() => setActiveTab('signup')}
                >
                    Sign Up
                </button>
                <button
                    className={activeTab === 'login' ? 'active' : ''}
                    onClick={() => setActiveTab('login')}
                >
                    Login
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'signup' && <Signup setActiveTab={setActiveTab} />}
                {activeTab === 'login' && <Login />}
            </div>
        </div>
    );
};

export default Auth;