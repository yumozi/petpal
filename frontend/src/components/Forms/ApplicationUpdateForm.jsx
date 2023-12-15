import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ApplicationUpdateForm() {
    const { id } = useParams();
    const [reason, setReason] = useState('');
    const [about, setAbout] = useState('');
    const [petHistory, setPetHistory] = useState(''); // Changed variable name to camelCase
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const api = `${process.env.REACT_APP_SERVER}/api/application/${id}/update`;

        try {
            const response = await fetch(api, {
                method: 'PUT',
                body: JSON.stringify({
                    reason: reason,
                    about: about,
                    pet_history: petHistory, // Match the field name with your backend
                }),
                headers: {
                    'Content-Type': 'application/json',
                    // Add your authorization header if needed
                },
            });

            if (!response.ok) {
                console.error('Error updating application:', response.statusText);
                return;
            }

            console.log('Application updated successfully');
            navigate(`/applications/${id}`); // Redirect to the application detail page
        } catch (error) {
            console.error('Error updating application:', error.message);
        }
    };

    const handleCancel = () => {
        // Navigate back to the application detail page with the dynamic id parameter
        navigate(`/applications/${id}`);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                    Reason for update:
                </label>
                <div className="mt-2">
                    <textarea
                        id="reason"
                        name="reason"
                        rows="3"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                </div>
            </div>
            <div>
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                    About the update:
                </label>
                <div className="mt-2">
                    <textarea
                        id="about"
                        name="about"
                        rows="3"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    ></textarea>
                </div>
            </div>
            <div>
                <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                        Pet history:
                    </legend>
                    <div className="mt-6 space-y-6">
                        <div className="flex items-center gap-x-3">
                            <input
                                id="pet-current"
                                name="petHistory"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                                value="Currently have other pets."
                                checked={petHistory === 'Currently have other pets.'}
                                onChange={() => setPetHistory('Currently have other pets.')}
                            />
                            <label htmlFor="pet-current" className="block text-sm font-medium leading-6 text-gray-900">
                                Currently have other pets.
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <input
                                id="pet-past"
                                name="petHistory"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                                value="Had pets growing up."
                                checked={petHistory === 'Had pets growing up.'}
                                onChange={() => setPetHistory('Had pets growing up.')}
                            />
                            <label htmlFor="pet-past" className="block text-sm font-medium leading-6 text-gray-900">
                                Had pets growing up.
                            </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <input
                                id="first-time"
                                name="petHistory"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                                value="First-time pet owner"
                                checked={petHistory === 'First-time pet owner'}
                                onChange={() => setPetHistory('First-time pet owner')}
                            />
                            <label htmlFor="first-time" className="block text-sm font-medium leading-6 text-gray-900">
                                First-time pet owner.
                            </label>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="mt-6 flex items-center justify-between gap-x-6">
                {/* Cancel Button */}
                <button
                    type="button"
                    onClick={handleCancel}
                    className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Cancel
                </button>
                {/* Update Button */}
                <button
                    type="submit"
                    className="flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                    Update
                </button>
            </div>
        </form>
    );
}

export default ApplicationUpdateForm;
