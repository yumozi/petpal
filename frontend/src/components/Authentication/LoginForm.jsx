import React from 'react';
import { useState } from 'react';
import UserContext from '../../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {

    const [error, setError] = useState(null);
    const { setToken } = useContext(UserContext);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = e.target.username.value;
            const password = e.target.password.value;
            console.log("Logging in as", username, "with password", password);
            const api = `${process.env.REACT_APP_SERVER}/api/token/`;
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            
            if (!response.ok) {
                setError("Invalid username or password");
                throw new Error(`${response.status}: ${response.statusText}`);           
            }
            const data = await response.json();
            setError(null);
            setToken(data.access);
            navigate('/search');
        }
        catch (error) {
            console.error("Something went wrong");
        }
    }
    
    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                <div className="mt-2">
                    <input id="username" name="username" type="username" autoComplete="username" required 
                           className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                </div>
                <div className="mt-2">
                    <input id="password" name="password" type="password" autoComplete="current-password" required 
                           className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
                </div>
            </div>

            {error && <div className="text-red-600">{error}</div>}

            <div>
                <button type="submit" 
                        onSubmit={handleSubmit}
                        className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                    Sign in
                </button>
            </div>
        </form>
    );
}

export default LoginForm;
