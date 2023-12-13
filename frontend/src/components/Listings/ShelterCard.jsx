import React from "react";

function ShelterCard({
  name,
  phoneNumber,
  location,
  bio,
  contactEmail,
  website,
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">

      {/* Example: <img src={shelterImageURL} alt={name} /> */}

      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-600">{location}</p>

        <div className="mt-2">
          <p className="text-gray-700">{bio}</p>
          <p className="mt-2 text-gray-700">Phone: {phoneNumber}</p>
          <p className="text-gray-700">Email: {contactEmail}</p>
          <p className="text-gray-700">
            Website: <a href={website}>{website}</a>
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-100 border-t border-gray-200">
        {/* any action buttons or functionality here */}
        {/* Example: Edit, Delete, View Details */}
      </div>
    </div>
  );
}

export default ShelterCard;
