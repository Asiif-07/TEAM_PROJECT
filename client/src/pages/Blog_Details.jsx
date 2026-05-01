import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import BlogDetailsHero from '../components/blog/BlogDetailsHero'
import BlogDetailsCardTypo from '../components/blog/BlogDetailsCardTypo'
import LatestBlogHeader from '../components/blog/BlogDetailsLatestPost'
import { getSingleBlog } from '../api/blog.js'
import { useAuth } from '../context/AuthContext.jsx'
import { CircularProgress } from '@mui/material'

const Blog_Details = () => {
  const { id } = useParams();
  const { accessToken, refreshAccessToken } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getSingleBlog({
          id,
          accessToken,
          refreshAccessToken
        });
        if (res.success) setBlog(res.blog);
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id, accessToken, refreshAccessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Blog not found</h2>
      </div>
    );
  }

  return (
    <div>
      <BlogDetailsHero blog={blog} />
      <BlogDetailsCardTypo blog={blog} />
      <LatestBlogHeader />
    </div>
  )
}

export default Blog_Details
