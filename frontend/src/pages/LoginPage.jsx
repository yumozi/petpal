import React from 'react';
import LoginForm from '../components/Authentication/LoginForm';
import RedirectPrompt from '../components/Authentication/RedirectPrompt';
import Header from '../components/Layout/Header';

const LoginPage = () => {
    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                <Header title="Sign in"/>
                
                <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <LoginForm />
                        <RedirectPrompt message="Don't have an account? " 
                                        actionText="Sign up"
                                        link="/signup-seeker" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;