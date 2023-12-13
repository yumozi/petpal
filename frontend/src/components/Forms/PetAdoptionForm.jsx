import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function PetAdoptionForm() {

    const { id } = useParams();
    const [seeker, setShelter] = useState(null);
    const [pets, setPets] = useState([]);
    const { token } = useContext(UserContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     async function getSeeker() {
    //         try {
    //             const api = `${process.env.REACT_APP_SERVER}/api/seekers/${id}`;
    //             console.log("The token is", token);
    //             const response = await fetch(api, {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 },
    //             });
    //             if (!response.ok) {
    //                 throw new Error(`${response.status}: ${response.statusText}`);
    //             }

    //             const data = await response.json();
    //             getSeeker(data);
    //         }
    //         catch (error) {
    //             console.error("Something went wrong");
    //         }
    //     }
    //     getSeeker();
    // }
    //     , [token, id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const reason = event.target.elements.reason.value;
        const about = event.target.elements.about.value;
        const pet_history = event.target.elements.pethistory.value;
        const api = `${process.env.REACT_APP_SERVER}/api/pet/${id}/application/`;
    
        try {
            const response = await fetch(api, {
                method: "POST",
                body: JSON.stringify({
                    reason: reason,
                    previous_pets: about,
                    previous_experience: pet_history
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            console.log("Pet adoption application submitted successfully");
            navigate('/search');
        } catch (error) {
            console.error("Error submitting application: ", error.message);
        }
    };
    

    const handleCancel = () => {
        // Navigate back to the pet listing page with the dynamic id parameter
        navigate(`/pet/${id}`);
    };
    

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
    <div>
        <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
            Reason for adoption:
        </label>
        <div className="mt-2">
            <textarea
                id="reason"
                name="reason"
                rows="3"
                className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            ></textarea>
        </div>
    </div>
    <div>
        <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
            Previous pet experience:
        </label>
        <div className="mt-2">
            <textarea
                id="about"
                name="about"
                rows="3"
                className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            ></textarea>
        </div>
    </div>
    <div>
        <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">
                Previous pet experience:
            </legend>
            <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                    <input
                        id="pet-current"
                        name="pethistory"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                    />
                    <label htmlFor="pet-current" className="block text-sm font-medium leading-6 text-gray-900">
                        Currently have other pets.
                    </label>
                </div>
                <div className="flex items-center gap-x-3">
                    <input
                        id="pet-past"
                        name="pethistory"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
                    />
                    <label htmlFor="pet-past" className="block text-sm font-medium leading-6 text-gray-900">
                        Had pets growing up.
                    </label>
                </div>
                <div className="flex items-center gap-x-3">
                    <input
                        id="first-time"
                        name="pethistory"
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-gray-600"
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

        {/* Save Button */}
        <button
            type="submit"
            className="flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
            Save
        </button>
    </div>
</form>

    );
}

export default PetAdoptionForm;
