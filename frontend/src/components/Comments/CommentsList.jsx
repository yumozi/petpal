import React, { useState, useEffect} from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../context/UserContext';

const CommentList = ({ entityType, entityId}) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const { token } = useContext(UserContext);

  const fetchComments = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setComments(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setIsLoading(false);
    }
  };

  const handlePrevClick = () => {
    if (prevPage) fetchComments(prevPage);
  };

  const handleNextClick = () => {
    if (nextPage) fetchComments(nextPage);
  };

  useEffect(() => {
    const api = `${process.env.REACT_APP_SERVER}/api/${entityType}/${entityId}/comments/`;
    fetchComments(api);
  }, [entityType, entityId, token]);

  return (
    <div className="container mx-auto py-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white shadow-md p-4 rounded-lg"
              >
                <p className="text-gray-600 text-sm">
                  {comment.text}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Created at: {comment.created_at}
                </p>
              </div>
            ))
          )}
                  <div className="flex justify-between">
                <button className="
                        relative inline-flex items-center px-2 py-2 rounded-l-md
                        border border-gray-300 bg-white text-sm font-medium
                        text-gray-700 hover:bg-gray-50 hover:cursor-pointer
                        disabled:opacity-50" onClick={handlePrevClick} disabled={!prevPage}>Previous</button>
                <button className="
                        relative inline-flex items-center px-2 py-2 rounded-l-md
                        border border-gray-300 bg-white text-sm font-medium
                        text-gray-700 hover:bg-gray-50 hover:cursor-pointer
                        disabled:opacity-50"
                        onClick={handleNextClick} disabled={!nextPage}>Next</button>
              </div>
      </div>
        </div>
    </div>
  );
};

export default CommentList;
