import React, { useState, useEffect } from 'react';
import HeroSection from '../components/blog/BlogHero.jsx';
import BlogGrid from '../components/blog/BlogGridCard.jsx';
import { getBlogs, getCategories } from '../api/blog.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CircularProgress } from '@mui/material';

export default function Blog() {
  const { accessToken, refreshAccessToken } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogsRes, catsRes] = await Promise.all([
          getBlogs({
            accessToken,
            refreshAccessToken
          }),
          getCategories({
            accessToken,
            refreshAccessToken
          })
        ]);

        if (blogsRes.success) setBlogs(blogsRes.blogs);
        if (catsRes.success) setCategories(catsRes.categories);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, refreshAccessToken]);

  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter(blog => blog.category?.name === selectedCategory);

  return (
    <div className="bg-white min-h-screen font-sans">
      <HeroSection
        categories={categories}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      {loading ? (
        <div className="flex justify-center py-20">
          <CircularProgress />
        </div>
      ) : (
        <BlogGrid blogs={filteredBlogs} />
      )}
    </div>
  );
}