import React from 'react';
import { useState } from 'react';
import UserContext from '../../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupSeekerForm() {
    const { setToken } = useContext(UserContext);
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [usernameError, setUsernameError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const username = e.target.username.value;
            const email = e.target.email.value;
            const password = e.target.password.value;
            const is_seeker = true;
            const api = `${process.env.REACT_APP_SERVER}/api/users/`;
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, is_seeker }),
            });
            
            const data = await response.json();
            if (!data.url) {
                if (data.username) {
                    setUsernameError(data.username[0]);
                }
                else {
                    setUsernameError(null);
                }

                if (data.email) {
                    setEmailError(data.email[0]);
                }
                else {
                    setEmailError(null);
                }

                if (data.password) {
                    setPasswordError(data.password[0]);
                }
                else {
                    setPasswordError(null);
                }

                throw new Error(`${response.status}: ${response.statusText}`);
            }
            setUsernameError(null);
            setEmailError(null);
            setPasswordError(null);

            console.log("User with username", username, "created successfully");

            // If the user was created successfully, log them in
            const apiLogin = `${process.env.REACT_APP_SERVER}/api/token/`;
            const responseLogin = await fetch(apiLogin, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const dataLogin = await responseLogin.json();
            if (!responseLogin.ok) {
                throw new Error(dataLogin.detail);
            }

            setToken(dataLogin.access);   
            navigate('/search');
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                <div className="mt-2">
                    <input
                        id="username"
                        name="username"
                        type="username"
                        autoComplete="username"
                        required
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            {usernameError && <div className="text-red-600">{usernameError}</div>}
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            {emailError && <div className="text-red-600">{emailError}</div>}
            <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            {passwordError && <div className="text-red-600">{passwordError}</div>}
            <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                    Sign up
                </button>
            </div>
        </form>
    );
}

export default SignupSeekerForm;
