import React from 'react';
import SignupSeekerForm from '../components/Forms/SignupSeekerForm';
import RedirectPrompt from '../components/Authentication/RedirectPrompt';
import Header from '../components/Layout/Header';

const SignupSeekerPage = () => {
    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                <Header title="Sign up" />
                
                <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <SignupSeekerForm />
                        <RedirectPrompt message="Have friends looking for homes? " 
                                        actionText="Register as a shelter." 
                                        link="/signup-shelter" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupSeekerPage;
