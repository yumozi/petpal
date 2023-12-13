import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogPost = ({ post }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/blog/${post.id}/`);
    };

    return (
        <div className="blog-post border border-gray-300 rounded-lg p-4 mb-4 shadow-md cursor-pointer" onClick={handleClick}>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <small className="text-gray-500 block mt-2">Posted on: {new Date(post.date_posted).toLocaleDateString()}</small>
        </div>
    );
};

export default BlogPost;
