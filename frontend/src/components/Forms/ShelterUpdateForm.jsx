import React from 'react';

function ShelterUpdateForm() {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the pet creation logic here.
    };

    const handleCancel = () => {
        // Handle cancel
    };

    return (
        <div>
            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Shelter Name:</label>
            <div className="mt-2">
                <textarea
                    id="reason"
                    name="reason"
                    rows="1"
                    className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                ></textarea>
            </div>
            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Location:</label>
            <div className="mt-2">
                <textarea
                    id="reason"
                    name="reason"
                    rows="1"
                    className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                ></textarea>
            </div>
            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Phone Number:</label>
            <div className="mt-2">
                <textarea
                    id="reason"
                    name="reason"
                    rows="1"
                    className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                ></textarea>
            </div>
            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Email Address:</label>
            <div className="mt-2">
                <textarea
                    id="reason"
                    name="reason"
                    rows="1"
                    className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                ></textarea>
            </div>

            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Mission Statement:</label>
            <div className="mt-2">
                <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                ></textarea>
            </div>
            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Shelter Picture:</label>
            <div className="flex items-center gap-x-3">
                <input
                    id="pet-current"
                    name="pet-history"
                    type="file"
                />
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
        </div>

    );
}

export default ShelterUpdateForm;
