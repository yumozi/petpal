import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { useContext } from 'react';
import Header from '../components/Layout/Header';
import { Link } from 'react-router-dom';
import CommentsList from '../components/Comments/CommentsList';
import PetCard from '../components/Listings/PetCard';
import { useNavigate } from 'react-router-dom';
import AddComments from '../components/Comments/AddComment';

export default function ShelterDetailPage() {

  const { id, } = useParams();
  const [shelter, setShelter] = useState(null);
  const [ pets, setPets ] = useState([]);
  const { setUser, setToken, token } = useContext(UserContext);
  const [ownID, setOwnID] = useState(null);
  const [petListings, setPetListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetListings = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVER}/api/shelters/${id}/pets/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Pet Listings:", data)
            setPetListings(data); // Update the state with the fetched pet listings
        } catch (error) {
            console.error("Failed to fetch pet listings:", error);
        }
    };

    fetchPetListings();
}, [id, token]);

  useEffect(() => {
    async function getShelter() {
      if (!token) {
        return;
      }

      try {
        const api = `${process.env.REACT_APP_SERVER}/api/shelters/${id}`;
        console.log("The token is", token);
        const response = await fetch(api, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` },
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

  useEffect(() => {
    async function getPets() {
      if (!token) {
        return;
      }
      try {
        const api = `${process.env.REACT_APP_SERVER}/api/shelters/${id}/pets`;
        console.log("The token is", token);
        const response = await fetch(api, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` },
          });
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setPets(data.results);
      }
      catch (error) {
        console.error("Something went wrong");
      }
    }
    getPets();
  }
  , [token, id]);

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


  if (!shelter) {
    return (
      <div>Loading...</div>
    )
  }

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



  return (
    <div>
      <Header title={shelter.name? shelter.name : "Shelter"} />
      <img className="h-auto mx-auto max-w-md max-w-lg rounded-lg my-10"
        src={shelter.profile_image ?  shelter.profile_image : "/logo512.png"} alt="logo"
      />
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Pet Information</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Location </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{shelter.location? shelter.location : "N/A"}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{shelter.phone_number? shelter.phone_number : "N/A"}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Email</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{shelter.contact_email? shelter.contact_email : "N/A"}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Bio</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{shelter.bio? shelter.bio : "N/A"}</dd>
          </div>
            <dt className="text-sm font-medium leading-6 text-gray-900">Pet Listings</dt>
            {/* Map pets dynamically here */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {petListings.map((pet) => (
                    <PetCard
                        key={pet.id}
                        name={pet.name}
                        age={pet.age}
                        breed={pet.breed}
                        distance={pet.distance}
                        id={pet.id}
                        image={pet.image}
                    />
                ))}
          </div>
        </dl>
      </div>
      {ownID == id && (
  <div className="flex items-center mt-4">
    <Link
      to="/shelter-update"
      className="ml-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded inline-block"
    >
      Update Shelter
    </Link>

    <button
      onClick={handleDelete}
      className="ml-2 bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded inline-block"
    >
      Delete Shelter
    </button>
  </div>
)}

        <CommentsList entityType="shelters" entityId={id} />
        <AddComments entityType="shelters" entityId={id} />
    </div>
  )
}