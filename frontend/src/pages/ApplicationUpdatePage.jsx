import React from 'react';
import ApplicationUpdateForm from '../components/Forms/ApplicationUpdateForm'; // Import the ApplicationUpdateForm component
import RedirectPrompt from '../components/Authentication/RedirectPrompt';
import Header from '../components/Layout/Header';

const ApplicationUpdatePage = () => {
    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                <Header title="Update Application" />
                
                <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <ApplicationUpdateForm />
                        {/* You can customize the redirect prompt message here */}
                        <RedirectPrompt message="Want to go back? " 
                                        actionText="Return to applications."
                                        link="/applications"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationUpdatePage;
