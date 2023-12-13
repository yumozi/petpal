import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Outlet } from 'react-router-dom'
import UserContext from '../../context/UserContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx';
import { set } from 'animejs'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Find A Pet', href: '/search', current: false },
  { name: 'Shelters', href: '/shelters', current: false },
  { name: 'Blogs', href: '/blog', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function Layout() {

  const { setUser, setToken, token } = useContext(UserContext);
  const [unreadNotifcation, setUnreadNotification] = useState(false);
  const [isSeeker, setIsSeeker] = useState(true); // Initialize isSeeker to true
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  }
  const handleNotification = () => {
    navigate('/notifications');
  }

  const handleProfile = () => {
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
          setIsSeeker(userData.is_seeker)
          console.log("User:", userData)
      } catch (error) {
          console.error("Failed to fetch user data:", error);
      }
    }
    if (token) {
        fetchUserId();
        if (isSeeker) {
          navigate(`/seeker/`);
        } else {
          navigate(`/shelter/${userId}/`);
        }
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setUser(JSON.parse(user));
      setToken(token);
    }
  }, [setUser, setToken]);

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
        var hasUnread = true;
        for (let i = 0; i < notifs.length; i++) {
            if(!notifs[i].is_read) {
              setUnreadNotification(true);
              hasUnread = true;
            }
        }
        if (!hasUnread) {
          setUnreadNotification(false);
        }
        console.log("The user has unread notifications:", hasUnread);
      }
      catch (error) {
        console.error(error);
      }
    }
    getNotifications();
  }
  , [token, setUnreadNotification]);

  useEffect(() => {
    async function checkIsSeeker() {
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
      } catch (error) {
        console.error("Error checking if the user is a seeker:", error);
      }
    }
    checkIsSeeker();
  }, [token]);

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="py-2 md:py-4">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <h1 className="flex-shrink-0">
                          <Link to="/" className="text-4xl text-gray-700 font-bold font-caveat">PetPal 🐶</Link>
                      </h1>
                    </div>
                    <div className="hidden absolute md:block md:relative">
                      <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.name === 'Shelters' && !isSeeker ? '/pet-listings' : item.href}
                            className={clsx(
                              item.current
                                ? 'bg-gray-200 text-black'
                                : 'text-gray-500 hover:bg-gray-300 hover:text-black',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name === 'Shelters' && !isSeeker ? 'My Pets' : item.name}
                          </Link>
                        ))}
                        <Link
                            to={'/applications'}
                            className="text-gray-500 hover:bg-gray-300 hover:text-black
                            rounded-md px-3 py-2 text-sm font-medium"
                          >
                            Applications
                          </Link>
                      </div>
                    </div>
                  </div>

                  {/* If logged in, show profile icon, else show login button */}
                  {token?
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        <button
                          type="button"
                          className="relative rounded-full bg-gray-300 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-500"
                          onClick={handleNotification}
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          {unreadNotifcation? 
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            <circle fill="#b91c1c" cx="18" cy="5" r="4" />
                          </svg> :
                          <BellIcon className="h-6 w-6" aria-hidden="true" />}
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                  {({ active }) => (
                                    <div
                                      onClick={handleProfile}
                                      className={clsx(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                      )}
                                    >
                                      Your Profile
                                    </div>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <div
                                      onClick={handleLogout}
                                      className={clsx(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                      )}
                                    >
                                      Log-out
                                    </div>
                                  )}
                                </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div> :
                    <div>
                      <Link to="/login" className="text-black text-2xl font-mono px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300">
                        Login
                      </Link>
                    </div>
                  }
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative ml-auto flex-shrink-0 p-1 text-gray-500 hover:text-gray-900 transition ease-in-out duration-150">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block font-normal text-gray-900 hover:text-gray-500 px-3 py-1 text-md transition ease-in-out duration-150 hover:text-gray-900 hover:bg-gray-100 hover:rounded-xl"
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-normal leading-none text-gray-900">{user.name}</div>
                      <div className="text-sm font-light leading-none text-gray-400">{user.email}</div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 p-1 text-gray-500 hover:text-gray-900 transition ease-in-out duration-150"
                      onClick={handleNotification}
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block font-normal text-gray-900 hover:text-gray-500 px-3 py-1 text-md transition ease-in-out duration-150  hover:text-gray-900 hover:bg-gray-100 hover:rounded-xl"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </main>
      </div>
    </>
  )
}