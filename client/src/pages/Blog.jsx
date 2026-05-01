import React from 'react';
import HeroSection from '../components/blog/BlogHero.jsx';
import ArticleCard from '../components/blog/BlogArticleCard.jsx';
import BlogGrid from '../components/blog/BlogGridCard.jsx';
export default function Blog() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <HeroSection />
      <ArticleCard />
      <BlogGrid />
      <BlogGrid/>
    </div>
  );
}