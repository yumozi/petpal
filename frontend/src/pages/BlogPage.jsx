import React from 'react';
import BlogPost from '../components/Blogs/BlogPost';
import blogData from './blogData.json'; // Adjust the path according to your file location

const BlogPage = () => {
    // Extracting the 'results' array from blogData
    const blogPosts = blogData.results;

    return (
        <div className="blog-page">
            {blogPosts.map(post => (
                <BlogPost key={post.id} post={post} />
            ))}
        </div>
    );
};

export default BlogPage;
