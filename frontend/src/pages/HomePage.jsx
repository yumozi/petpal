import React from 'react';
import Header from '../components/Layout/Header';
import SearchBar from '../components/Listings/SearchBar';

const HomePage = () => {
    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                <div className="text-center">
                    {/* Hero */}
                    <h1 className="text-4xl tracking-tight text-gray-900 sm:text-6xl font-serif">
                        Your new best friend is waiting for you.
                    </h1>
                    <p className="mt-6 sm:mt-10 text-lg leading-8 text-gray-600 text-base font-normal">
                        PetPal is the easiest way to find your new best friend. Search through thousands of pets in your area and find the perfect match for you.
                    </p>
                    {/* Search bar */}
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <div className="w-full sm:max-w-lg">
                            <SearchBar onSubmit={(e) => {
                                e.preventDefault();
                                const params = new URLSearchParams({ q: e.target.search.value });
                                window.location.href = `/search?${params.toString()}`;
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
