import React from 'react';
import SignupShelterForm from '../components/Forms/SignupShelterForm';
import RedirectPrompt from '../components/Authentication/RedirectPrompt';
import Header from '../components/Layout/Header';

const SignupShelterPage = () => {
    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                <Header title="Register" />
                
                <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <SignupShelterForm />
                        <RedirectPrompt message="Looking for a friend instead? " 
                                        actionText="Sign up to adopt." 
                                        link="/signup-seeker" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupShelterPage;
