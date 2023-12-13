import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/UserContext';
import Header from '../components/Layout/Header';
import { useNavigate } from 'react-router-dom';

export default function SeekerDetailPage() {
  const [seeker, setSeeker] = useState(null);
  const navigate = useNavigate();
  const [ownID, setOwnID] = useState(null);
  const { setUser, setToken, token } = useContext(UserContext);

  useEffect(() => {
    async function getOwnID() {
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
        setOwnID(userData.id);
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    }
    getOwnID();
  }, [token]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/api/users/${ownID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error in deleting shelter');
      }

      // Handle the successful deletion, like redirecting or updating the UI
      console.log('Shelter deleted successfully');
      // Log the user out by removing the token from localStorage
      localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
    } catch (error) {
      console.error('Error deleting shelter:', error);
    }
  };

  useEffect(() => {
    async function getSeekerData() {
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

        const data = await response.json();
        // Extract username and email from the API response
        const { username, email } = data;
        setSeeker({ username, email });
      } catch (error) {
        console.error("Something went wrong");
      }
    }
    getSeekerData();
  }, [token]);

  //Use effect called on http://127.0.0.1:8000/api/applications/ to see the seeker's applications.
  useEffect(() => {
    async function getApplications() {
      if (!token) {
        return;
      }

      try {
        const api = `${process.env.REACT_APP_SERVER}/api/applications`;
        const response = await fetch(api, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // Extract username and email from the API response
        console.log(data)
      } catch (error) {
        console.error("Something went wrong");
      }
    }
    getApplications();
  }, [token]);


  if (!seeker) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header title="Seeker Detail" />
      <div className="px-4 sm:px-0 flex justify-between">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Seeker Information
        </h3>
        <button
          onClick={() => {
            // Navigate to the seeker update page
            navigate("/seeker-update/");
          }}
          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
      <div className="px-4 sm:px-0">
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Personal details and application.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Username
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {seeker.username}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {seeker.email}
            </dd>
          </div>
          {/* Add more seeker-specific information here if available */}
        </dl>
      </div>
      <button
      onClick={handleDelete}
      className="ml-2 bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded inline-block"
    >
      Delete Account
    </button>
    </div>
  );
}
