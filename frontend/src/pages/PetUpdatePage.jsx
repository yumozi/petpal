import React from 'react';
import PetUpdateForm from '../components/Forms/PetUpdateForm';
import RedirectPrompt from '../components/Authentication/RedirectPrompt';
import Header from '../components/Layout/Header';

const PetUpdatePage = () => {
    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                <Header title="Update Pet" />
                
                <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
                        <PetUpdateForm/>
                        {/* You can customize the redirect prompt message here */}
                        <RedirectPrompt message="Need more information? " actionText="Contact us." />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetUpdatePage;
