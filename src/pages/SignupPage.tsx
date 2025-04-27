import React from 'react';
import Signup from '../components/Signup';
import Login from '../components/Login'; // Assuming you have a Login component
import 'bootstrap/dist/css/bootstrap.min.css';

const SignupPage: React.FC = () => {
    const setActiveTab = (tab: 'signup' | 'login') => {
        const tabElement = document.querySelector(`#${tab}-tab`) as HTMLElement;
        if (tabElement) {
            tabElement.click(); // Programmatically click the tab to switch
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Vaccine Drive Portal</h1>
            <ul className="nav nav-tabs" id="authTabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link active"
                        id="login-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#login"
                        type="button"
                        role="tab"
                        aria-controls="login"
                        aria-selected="true"
                    >
                        Login
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="signup-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#signup"
                        type="button"
                        role="tab"
                        aria-controls="signup"
                        aria-selected="false"
                    >
                        Sign Up
                    </button>
                </li>
            </ul>
            <div className="tab-content mt-4" id="authTabsContent">
                <div
                    className="tab-pane fade show active"
                    id="login"
                    role="tabpanel"
                    aria-labelledby="login-tab"
                >
                    <Login />
                </div>
                <div
                    className="tab-pane fade"
                    id="signup"
                    role="tabpanel"
                    aria-labelledby="signup-tab"
                >
                    <Signup setActiveTab={setActiveTab} /> 
                </div>
            </div>
        </div>
    );
};

export default SignupPage;