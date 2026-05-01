import React from 'react';
import PublicIcon from '@mui/icons-material/Public'; // Globe icon for 'Blogs' badge
import BlogGrid from './BlogGridCard';

const LatestBlogHeader = () => {
  return (
    <div className="relative w-full py-20  bg-white flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto mb-4">

        {/* Badge / Chip */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-6 shadow-sm">
          <PublicIcon sx={{ fontSize: 16 }} />
          <span className="text-xs font-bold uppercase tracking-wide">Blogs</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Latest <span className="text-blue-600">Blog</span> Post
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-lg md:text-xl font-normal leading-relaxed">
          The latest tips for resume making, cover letters, interviews, and more.
        </p>

      </div>
      <BlogGrid />
    </div>
  );
};

export default LatestBlogHeader;