import React from 'react';
import Header from '../components/Layout/Header';

const NotFoundPage = () => {
    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                <Header title="404 - Page Not Found" subtitle="Sorry, this page is barking up the wrong tree!" />
                <div className="text-center mt-6">
                    <p className="text-gray-700 text-lg">It seems like you've lost your way. Maybe it's time for a walk with your furry friend?</p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
