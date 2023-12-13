import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { useContext } from 'react';
import Header from '../components/Layout/Header';
import { Link } from 'react-router-dom';

export default function ApplicationDetailPage() {

    const { id } = useParams();
    const { token } = useContext(UserContext);
    const [applications, setApplications] = useState(null);

    useEffect(() => {
        async function getApplications() {
            try {
                const api = `${process.env.REACT_APP_SERVER}/api/application/detail/${id}/`;
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
                console.log("data: ", data)
                setApplications(data);
            }
            catch (error) {
                console.error("Something went wrong");
            }
        }
        getApplications();
    }
        , [token, id]);

    console.log(applications)

    if (!applications) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Application Information</h3>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Application ID</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {applications.id? applications.id : "N/A"}
                </dd>

                </div>
                
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {applications.status? applications.status : "N/A"}
                </dd>

                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Pet ID</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {applications.pet? applications.pet : "N/A"}
                </dd>

                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Shelter ID</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {applications.shelter? applications.shelter : "N/A"}
                </dd>

                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Applicant Reason</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {applications.reason? applications.reason : "N/A"}
                </dd>

                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">Applicant Experience</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {applications.previous_experience? applications.previous_experience : "N/A"}
                </dd>

                </div>
                </dl>
            </div>
        </div>

    )
}