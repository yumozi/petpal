import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import { useContext } from 'react';

function BlogForm({ shelterId }) {
  // State variables to store form input values
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const {token}  = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const apiUrl = `${process.env.REACT_APP_SERVER}/api/shelters/${shelterId}/create-blog/`;
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          // Include any other data you want to send to the server
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      // Clear the form fields after successful submission
      setTitle('');
      setContent('');
  
      // Redirect to /shelter/5/blogs after successful submission
      navigate(`/shelter/${shelterId}/blogs`);
    } catch (error) {
      console.error('Error submitting the form:', error);
      // Handle errors or show an error message to the user
    }
  };
  

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
        <div className="mt-2">
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">Content</label>
        <div className="mt-2">
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
          ></textarea>
        </div>
      </div>
      <button
        type="submit"
        className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        Create Blog Post
      </button>
    </form>
  );
}

export default BlogForm;
