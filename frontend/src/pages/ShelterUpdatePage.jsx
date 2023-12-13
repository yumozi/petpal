import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import Header from '../components/Layout/Header';

export default function ShelterUpdatePage() {
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    phone_number: '',
    location: '',
    bio: '',
    profile_image: null,
    name: '',
    contact_email: '',
    website: '',
  });
  const [isShelter, setIsShelter] = useState(true);
  let userId = null; // Initialize userId as null

  useEffect(() => {
    async function getUserData() {
      if (!token) {
        return;
      }

      try {
        const api = `${process.env.REACT_APP_SERVER}/api/users/me`;
        const response = await fetch(api, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        const userData = await response.json();
        setIsShelter(!userData.is_seeker);

        // If the user is not a seeker, fetch shelter data and assign userId
        if (!userData.is_seeker) {
          userId = userData.id; // Assign userId here
          const shelterApi = `${process.env.REACT_APP_SERVER}/api/shelters/${userId}`;
          const shelterResponse = await fetch(shelterApi, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!shelterResponse.ok) {
            throw new Error(`${shelterResponse.status}: ${shelterResponse.statusText}`);
          }

          const shelterData = await shelterResponse.json();
          setFormData(shelterData);
        }
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    }
    getUserData();
  }, [token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the userId here
      const userApi = `${process.env.REACT_APP_SERVER}/api/users/me`;
      const userResponse = await fetch(userApi, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`${userResponse.status}: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      const userId = userData.id;
      const api = `${process.env.REACT_APP_SERVER}/api/shelters/${userId}/`;
      console.log(JSON.stringify(formData));
      const response = await fetch(api, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      // Handle successful update (e.g., show a success message)
      console.log("Shelter data updated successfully.");
    } catch (error) {
      console.error("Something went wrong while updating shelter data:", error);
    }
  };

  return (
    <div>
      <Header title="Update Shelter Information" />
      {isShelter ? (
        <form onSubmit={handleFormSubmit}>
          {/* Form fields pre-filled with shelter data */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone Number:
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location:
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bio:
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="border rounded w-full py-2 px-3"
            ></textarea>
          </div>
          {/* Other form fields similarly pre-filled */}
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
            Profile Image:
        </label>
        <input
            type="file"
            name="profile_image"
            // Implement input change handler for file upload here
            className="border rounded w-full py-2 px-3"
        />
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
        </label>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded w-full py-2 px-3"
        />
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
            Contact Email:
        </label>
        <input
            type="email"
            name="contact_email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="border rounded w-full py-2 px-3"
        />
        </div>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
            Website:
        </label>
        <input
            type="url"
            name="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="border rounded w-full py-2 px-3"
        />
        </div>

          {/* Submit button */}
          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </form>
      ) : (
        <p>This page is for shelters only</p>
      )}
    </div>
  );
}
