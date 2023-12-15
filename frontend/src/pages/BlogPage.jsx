import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import BlogPost from '../components/Blogs/BlogPost';
import UserContext from '../context/UserContext';


const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isShelter, setIsShelter] = useState(false); // State to check if the user is a shelter
  const { token }  = useContext(UserContext);
  const [userId, setUserId] = useState(null); // State to store the user's id

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const api = `${process.env.REACT_APP_SERVER}/api/blogs/`;
        const response = await fetch(api, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setBlogPosts(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchBlogPosts();
  }, []);

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
        const userid = userData.id;
        setUserId(userid); // Update userId based on user data
        setIsShelter(!userData.is_seeker); // Update isShelter based on user data
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    }

    getUserData();
  }, [token]);

  return (
    <div className="blog-page">
      {isShelter && (
        <div className="flex justify-end mb-4">
          <Link to={`/shelter/${userId}/blog/create`} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
            {/* Button to create a blog post for shelters */}
            Create Blog Post
          </Link>
        </div>
      )}
  
      {blogPosts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
  
};

export default BlogPage;
