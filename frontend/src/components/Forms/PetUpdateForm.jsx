import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function PetCreationForm() {

    const { id, type } = useParams();
    const [shelter, setShelter] = useState(null);
    const [pets, setPets] = useState([]);
    const { token } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function getShelter() {
            try {
                console.log(id, type)
                const api = `${process.env.REACT_APP_SERVER}/api/shelters/${id}`;
                console.log("The token is", token);
                const response = await fetch(api, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setShelter(data);
            }
            catch (error) {
                console.error("Something went wrong");
            }
        }
        getShelter();
    }
        , [token, id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const petname = event.target.elements.petname.value
        const age = event.target.elements.age.value
        const breed = event.target.elements.breed.value
        const size = event.target.elements.size.value
        const gender = event.target.elements.gender.value
        const description = event.target.elements.description.value
        const api = `${process.env.REACT_APP_SERVER}/api/pets/${type}`;
        //await 
        const response = fetch(api, {
            method: "PUT",
            body: JSON.stringify({
                name: petname,
                age: age,
                breed: breed,
                size: size,
                gender: gender,
                description: description
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
    };

    const handleCancel = () => {
        navigate(`/pet/${id}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Pet Name:</label>
                <div className="mt-2">
                    <textarea
                        id="petname"
                        name="petname"
                        rows="1"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>
                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Age:</label>
                <div className="mt-2">
                    <textarea
                        id="age"
                        name="age"
                        rows="1"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>
                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Breed:</label>
                <div className="mt-2">
                    <textarea
                        id="breed"
                        name="breed"
                        rows="1"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>
                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Size:</label>
                <div className="mt-2">
                    <textarea
                        id="size"
                        name="size"
                        rows="1"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>

                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Gender:</label>
                <div className="mt-2">
                    <textarea
                        id="gender"
                        name="gender"
                        rows="1"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>

                <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Description:</label>
                <div className="mt-2">
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    ></textarea>
                </div>
                {/* <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Pet Photo:</label>
                <div className="flex items-center gap-x-3">
                    <input
                        id="pet-current"
                        name="pet-history"
                        type="file"
                    />
                </div> */}
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
                        //onClick={handleSubmit}
                        className="flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
}

export default PetCreationForm;
