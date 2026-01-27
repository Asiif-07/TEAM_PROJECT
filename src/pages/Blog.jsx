import React from 'react';
import HeroSection from '../components/ui/BlogHero.jsx';
import ArticleCard from '../components/ui/BlogArticleCard.jsx';
import BlogGrid from '../components/ui/BlogGridCard.jsx';
export default function Blog() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <HeroSection />
      <ArticleCard />
      <BlogGrid />
    </div>
  );
}