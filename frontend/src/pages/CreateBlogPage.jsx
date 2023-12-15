import React from 'react';
import BlogPost from '../components/Blogs/BlogPost';
import BlogForm from '../components/Forms/CreateBlogForm';
import { useParams } from 'react-router-dom';

const CreateBlogPage = () => {
const { shelterId } = useParams();
  return (
    <div className="mx-auto max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        <h1 className="text-3xl font-extrabold text-gray-900">Create a Blog Post</h1>

        <div className="flex min-h-full flex-col px-6 py-12 lg:px-8">
          <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
            <BlogForm shelterId={shelterId}/>
            {/* You can customize the redirect prompt message here */}
            {/* <RedirectPrompt message="Need more information? " actionText="Contact us." /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;
