import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShelterCard from "../components/Listings/ShelterCard";

function ShelterListingsPage() {
  const navigate = useNavigate();

  // State to store shelter data
  const [shelters, setShelters] = useState([]);

  // Fetch shelter data from the API
  useEffect(() => {
    const url = `${process.env.REACT_APP_SERVER}/api/shelters/`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setShelters(data.results);
      })
      .catch((error) => {
        console.error("Error fetching shelter data: ", error);
      });
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div className="flex justify-between">
        <h3 className="text-gray-700 text-2xl font-medium">Shelters</h3>
      </div>
              <div class="flex flex-1 justify-between">
                <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
        </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
        {shelters.map((shelter) => (
          <ShelterCard
            key={shelter.url}
            // Pass shelter data as props to ShelterCard component
            name={shelter.name}
            phoneNumber={shelter.phone_number}
            location={shelter.location}
            bio={shelter.bio}
            contactEmail={shelter.contact_email}
            website={shelter.website}
            owner={shelter.owner}
          />
        ))}
      </div>
    </div>
  );
}

export default ShelterListingsPage;
