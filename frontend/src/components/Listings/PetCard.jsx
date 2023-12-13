import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ name, age, breed, distance, id, image}) => {

    const petDetailURL = `/pet/${id}/`;
    return (
        <Link to={petDetailURL} className="group border-2 border-gray-200 rounded-lg">
            <div className="aspect-square rounded-t-lg w-full overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                <div className="relative h-full w-full bg-gray-900">
                    <img
                        src={image}
                        alt={name}
                        className="object-cover object-center transform transition-all duration-500 ease-in-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 top-0 flex h-full items-end justify-start overflow-hidden p-4">
                        <div className="flex flex-col space-y-1">
                            {/* Any additional content can go here */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-1 p-2">
                <h1 className="font-bold text-gray-600 text-lg sm:text-2xl">{name}</h1>
                <div className="flex flex-wrap gap-y-2 gap-x-2 items-start justify-start">
                    <div className="text-white text-xs drop-shadow-sm rounded-lg bg-gray-300 px-2 py-1 font-bold">
                        {age}
                    </div>
                    <div className="text-white text-xs drop-shadow-sm rounded-lg bg-gray-300 px-2 py-1 font-bold">
                        {breed}
                    </div>
                    <div className="text-white text-xs drop-shadow-sm rounded-lg bg-gray-300 px-2 py-1 font-bold">
                        {distance}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PetCard;