
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function PetCreationForm() {

    const [shelter, setShelter] = useState(null);
    const [pets, setPets] = useState([]);
    const { token } = useContext(UserContext);
    const [userId, setUserId] = useState(null); // State to store the user's ID
    const [imageFile, setImageFile] = useState(null); // State to store the selected image file
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        // Update the imageFile state when a file is selected
        const selectedFile = event.target.files[0];
        setImageFile(selectedFile);
      };


    // Fetch the user's ID from the API
    useEffect(() => {
        async function fetchUserId() {
            try {
                const meApi = `${process.env.REACT_APP_SERVER}/api/users/me`;
                const response = await fetch(meApi, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`${response.status}: ${response.statusText}`);
                }

                const userData = await response.json();
                setUserId(userData.id);
                console.log("User:", userData)
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }

        if (token) {
            fetchUserId();
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const petname = event.target.elements.petname.value;
        const age = event.target.elements.age.value;
        const breed = event.target.elements.breed.value;
        const size = event.target.elements.size.value;
        const gender = event.target.elements.gender.value;
        const description = event.target.elements.description.value;
        const api = `${process.env.REACT_APP_SERVER}/api/shelters/${userId}/pets/`;
      
        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('name', petname);
        formData.append('age', age);
        formData.append('breed', breed);
        formData.append('size', size);
        formData.append('gender', gender);
        formData.append('description', description);
        formData.append('image', imageFile); // Append the selected image
      
        try {
          const response = await fetch(api, {
            method: 'POST',
            body: formData, // Use the FormData object for the body
            headers: {
              // Remove 'Content-Type' header to let the browser set the appropriate boundary
              'Authorization': `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
          }
          navigate('/pet-listings');
        } catch (error) {
          console.error('Failed to create a pet:', error);
        }
      };
      

    const handleCancel = () => {
        // Handle cancel
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

                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">Gender:</label>
                <div className="mt-2">
                    <select
                        id="gender"
                        name="gender"
                        className="block w-full rounded-md border-0 py-1.5 pl-1.5 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="mt-6">
                <label htmlFor="pet-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Pet Photo:
                </label>
                <div className="flex items-center gap-x-3 mt-2">
                <input
                    id="pet-photo"
                    name="pet-photo"
                    type="file"
                    accept="image/*" // Specify that only image files can be selected
                    onChange={handleImageChange} // Handle the file selection
                />
                </div>
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
