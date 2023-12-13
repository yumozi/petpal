import React, { useState, useContext } from 'react';
import UserContext from '../../context/UserContext';

const AddComments = ({ entityType, entityId }) => {
  const [commentText, setCommentText] = useState('');
  const { token } = useContext(UserContext);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_SERVER}/api/${entityType}/${entityId}/comment/`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: commentText })
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      } else {
        // Fetch the updated comments list
        window.location.reload();
      }

      // Clear the comment text input after successful submission
      setCommentText('');
      // You can also handle any other actions you need here after successful submission
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="mt-4">
      <textarea
        className="w-full p-2 border rounded"
        rows="4"
        placeholder="Add your comment..."
        value={commentText}
        onChange={handleCommentChange}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSubmit}
        disabled={!commentText}
      >
        Submit
      </button>
    </div>
  );
};

export default AddComments;
