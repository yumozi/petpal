import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import Header from '../components/Layout/Header';
import { useNavigate } from 'react-router-dom';

export default function SeekerUpdatePage() {
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [isSeeker, setIsSeeker] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
        setIsSeeker(userData.is_seeker);

        // If the user is not a seeker, fetch seeker data and assign userId
        if (userData.is_seeker) {
          setUserId(userData.id); // Assign userId here
          const seekerApi = `${process.env.REACT_APP_SERVER}/api/users/${userId}`;
          const seekerResponse = await fetch(seekerApi, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!seekerResponse.ok) {
            throw new Error(`${seekerResponse.status}: ${seekerResponse.statusText}`);
          }

          const seekerData = await seekerResponse.json();
          setFormData({
            username: seekerData.username,
            email: seekerData.email,
          });
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
      const api = `${process.env.REACT_APP_SERVER}/api/users/${userId}/`;
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

      // Handle successful update, redirect back to seeker detail page
      console.log('Seeker data updated successfully');
      navigate(`/seeker/`);
      
    } catch (error) {
      console.error("Something went wrong while updating seeker data:", error);
    }
  };

  return (
    <div>
      <Header title="Update Seeker Information" />
      {isSeeker ? (
        <form onSubmit={handleFormSubmit}>
          {/* Form fields for username and email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
        <p>This page is for seekers only</p>
      )}
    </div>
  );
}
