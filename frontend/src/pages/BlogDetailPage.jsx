import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Layout/Header';
import blogData from './blogData.json'; // Adjust path as necessary

const BlogDetailPage = () => {
    const { blogId } = useParams();
    const post = blogData.results.find(post => post.id === parseInt(blogId));

    return (
        <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="py-16">
                {post ? (
                    <div>
                        <Header title={post.title} />
                        <div className="mt-6">
                            <p className="text-gray-700 text-lg leading-relaxed">{post.content}</p>
                            <small className="text-gray-500 block mt-4">Posted on: {new Date(post.date_posted).toLocaleDateString()}</small>
                        </div>
                    </div> 
                ) : (
                    <Header title="Blog post not found" subtitle="The requested blog post could not be found." />
                )}
            </div>
        </div>
    );
};

export default BlogDetailPage;
