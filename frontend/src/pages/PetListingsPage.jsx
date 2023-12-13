
import React, { useState, useEffect } from 'react';
import PetUpdateForm from '../components/Forms/PetUpdateForm';
import RedirectPrompt from '../components/Authentication/RedirectPrompt';
import Header from '../components/Layout/Header';
import PetCard from '../components/Listings/PetCard';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

// const rows = [];
// for (let i = 0; i < 10; i++) {
//     // note: we are adding a key prop here to allow react to uniquely identify each
//     // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
//     rows.push(<PetCard name="Buddy" age="2 years" breed="Golden Retriever" distance="5 miles" />);
// }

// const PetListingsPage = () => {
//     return (
//         <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
//             <div className="py-16">
//                 <Header title="Pet Listings" />

//                 <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
//                     <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
//                         <tbody>{rows}</tbody>;
//                         {/* You can customize the redirect prompt message here */}
//                         <RedirectPrompt message="Need more information? " actionText="Contact us." />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PetListingsPage;


function PetListingsPage() {
    const navigate = useNavigate();
    const [petListings, setPetListings] = useState([]);
    const { token } = useContext(UserContext);
    const [userId, setUserId] = useState(null);

    const handleAddNewPet = () => {
        navigate(`/shelter/pet-creation`);
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

    // Fetch pet listings when the component mounts
    useEffect(() => {
      const fetchPetListings = async () => {
          try {
              
              const response = await fetch(`${process.env.REACT_APP_SERVER}/api/shelters/${userId}/pets/`, {
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
  }, [userId, token]);

    return (
        <div className="container mx-auto px-6">
              <div className="flex justify-between">
                <h3 className="text-gray-700 text-2xl font-medium">My Pets</h3>
                  <button 
                  onClick={handleAddNewPet}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Add New Pet
                  </button>
              </div>
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
        </div>
    );
  }
  
  export default PetListingsPage;