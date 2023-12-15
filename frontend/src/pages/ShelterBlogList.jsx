import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import BlogPost from '../components/Blogs/BlogPost';
import UserContext from '../context/UserContext';
import { useParams } from 'react-router-dom';

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const { token } = useContext(UserContext);
  // Get the blog id from the URL:
  const { shelterId } = useParams();

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        console.log(shelterId);
        const api = `${process.env.REACT_APP_SERVER}/api/shelters/${shelterId}/blogs/`;
        console.log(api)
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
        console.log(data.results)
        setLoading(false); // Set loading to false when the fetch is done
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <div className="blog-list">
      {loading ? (
        // Show a loading message or spinner while loading
        <p>Loading...</p>
      ) : blogPosts.length === 0 ? (
        // Display "This shelter has no blog posts." if there are no blog posts
        <p>This shelter has no blog posts.</p>
      ) : (
        // Render the blog posts once loading is complete
        blogPosts.map((post) => (
          <BlogPost key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default BlogList;
