import React, { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { set } from 'animejs';

const NotificationPage = () => {

    const [notifications , setNotifications] = useState([])
    const { token } = useContext(UserContext);
    const navigate = useNavigate();
    
    const handleDelete = (id) => async (e) => {
        e.preventDefault();
        try {
            const api = `${process.env.REACT_APP_SERVER}/api/notifications/${id}/`;
            console.log("The token is", token);

            const response = await fetch(api, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            });

            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
            
            setNotifications(notifications.filter((notification) => notification.id !== id));

            const apiRead = `${process.env.REACT_APP_SERVER}/api/notifications/mark-as-read/${id}/`;
            console.log("The token is", token);

            const responseRead = await fetch(apiRead, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            });

            if (!responseRead.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleClick = (id, link) => async (e) => {
        e.preventDefault();
        try {
            const api = `${process.env.REACT_APP_SERVER}/api/notifications/mark-as-read/${id}/`;
            console.log("The token is", token);

            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            });

            if (!response.ok) {
                throw new Error(`${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);
            console.log("Navigating to", link);
            navigate(link);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function getNotifications() {
          if (!token) {
            return;
          }
          try {
            const api = `${process.env.REACT_APP_SERVER}/api/notifications/`;
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
            const notifs = data.results;
            var link = null;

            // Parse notifs
            for (let i = 0; i < notifs.length; i++) {
                link = notifs[i].associated_link;
                if (link.includes("application")) {
                    notifs[i].message = "There is an update to your application";
                    notifs[i].associated_link = `/applications/${notifs[i].object_id}`;
                }
                else if (link.includes("pet")) {
                    notifs[i].message = "There is a new pet listing!";
                }
                else if (link.includes("comment")) {
                    notifs[i].message = "You have a new comment!";
                }

                // Format timestamp
                const date = new Date(notifs[i].timestamp);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                
                notifs[i].timestamp = `${year}-${month}-${day}`;
            }



            setNotifications(data.results);
          }
          catch (error) {
            console.error("Something went wrong");
          }
        }
        getNotifications();
      }
      , [token]);

    return (
        <div className="px-2 py-2 mx-auto max-w-7xl sm:py-6 sm:px-6 lg:px-8">
            <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                <li className="flex justify-between gap-x-6 p-6 border-gray-100 rounded-lg my-2 bg-gray-50 hover:pl-6 hover:bg-gray-100"
                    key={notification.id}>

                    <div className="flex min-w-0 gap-x-4" onClick={handleClick(notification.id, notification.associated_link)}>
                        {!notification.is_read? 
                        <div className="rounded-full border-1 border-red bg-red-500 text-red-500">.</div> :
                        <div className="rounded-full border-1 border-green bg-green-500 text-green-500">.</div>}
                        <div className="min-w-0 flex items-center">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{notification.message? notification.message : "You have a notification" }</p>
                        </div>
                        </div>
                        <div className="flex items-center shrink-0 sm:flex">
                            <p className="text-sm leading-6 text-gray-900"><time>{notification.timestamp? notification.timestamp : "2023-12-13" }</time></p>
                        <div className="px-5 mx-5 text-sm leading-6 text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={handleDelete(notification.id)}>
                            Delete
                        </div>

                    </div>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationPage;