import React from 'react';
import { Link } from 'react-router-dom';

const RedirectPrompt = ({ message, actionText, link }) => {
    return (
        <div className="text-center text-sm text-gray-500 mt-10">
            {message}
            <Link className="font-semibold leading-6 text-gray-600 hover:text-gray-500" to={link}>
                {actionText}
            </Link>
        </div>
    );
};

export default RedirectPrompt;
