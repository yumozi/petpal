import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';

const LikeButton = ({ postId }) => {
  const { token } = useContext(UserContext);
  const [likesCount, setLikesCount] = useState(0);
  const [userId, setUserId] = useState(null); // State to store the user's ID
  const [username, setUsername] = useState(null); // State to store the user's username
  const [isLiked, setIsLiked] = useState(false); // State to store whether the user has liked the post

  useEffect(() => {
    async function fetchUserData() {
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
        setUsername(userData.username);
        console.log("User:", userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }

    if (token) {
      fetchUserData(); // Fetch user data only when the token is available
    }
  }, [token]);

  // Define the fetchLikes function before using it
  const fetchLikes = async () => {
    try {
      const likeApiUrl = `${process.env.REACT_APP_SERVER}/api/get-likes/${postId}`;
      const response = await fetch(likeApiUrl, {
        headers: {
          Authorization: `Token ${token}`, // Include the user's token
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setLikesCount(data.likes.length);
      setIsLiked(data.likes.includes(username));
      console.log("Likes:", isLiked);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  useEffect(() => {
    // Call fetchLikes within useEffect
    fetchLikes();
  }, [postId, token, username]);

  const handleLikeClick = async () => {
    try {
      let likeApiUrl = '';
      if (isLiked) {
        // If the user has already liked the post, unlike it
        likeApiUrl = `${process.env.REACT_APP_SERVER}/api/unlike/${postId}/`;
      } else {
        // If the user hasn't liked the post, like it
        likeApiUrl = `${process.env.REACT_APP_SERVER}/api/like/${postId}/`;
      }

      const response = await fetch(likeApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include the user's token
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw Error(`HTTP Error! Status: ${response.status}`);
      }

      // After successfully liking/unliking the post, fetch and update the likes count
      fetchLikes();
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  return (
    <button onClick={handleLikeClick} className={`bg-blue-500 text-white px-4 py-2 rounded ${isLiked ? 'bg-red-500' : ''}`}>
      {likesCount} liked
    </button>
  );
};

export default LikeButton;
