import React from 'react';
import { Avatar, Chip, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';

// ==========================================
// 1. REUSABLE CHILD COMPONENT (BlogCard)
// ==========================================
const BlogCard = ({ 
  id,
  image, 
  category, 
  title, 
  description, 
  authorName, 
  authorAvatar, 
  readTime 
}) => {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 h-full">
      
      {/* Card Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Category Badge */}
        <div className="mb-3">
          <Chip 
            label={category} 
            size="small"
            sx={{
              backgroundColor: '#EFF6FF', // Tailwind blue-50
              color: '#2563EB',           // Tailwind blue-600
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '24px',
              borderRadius: '6px'
            }}
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>

        {/* Meta Section (Author + Time) */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-6">
            
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar 
                src={authorAvatar} 
                alt={authorName}
                sx={{ width: 24, height: 24 }} 
              />
              <span className="text-sm font-semibold text-gray-900">
                {authorName}
              </span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Read More Button */}
          <Button 
            component={Link}
            to={`/blog/details/${id}`}
            variant="outlined" 
            fullWidth
            sx={{
              textTransform: 'none',
              borderColor: '#E5E7EB', // gray-200
              color: '#374151',       // gray-700
              borderRadius: '8px',
              padding: '8px',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#D1D5DB',
                backgroundColor: '#F9FAFB',
              }
            }}
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;