import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  Chip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const BlogHeroSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'CV Writing', 'Interview Tips', 'Career Advice', 'LinkedIn', 'Job Search'];

  return (
    <div className="relative w-full bg-white pt-20 pb-12 flex flex-col items-center text-center px-4 overflow-hidden">
      
      {/* BACKGROUND BLOB (The blue glow in top right) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>

      {/* TOP BADGE */}
      {/* --- ICON: Sparkle Icon (AutoAwesome) --- */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 z-10">
        <AutoAwesomeIcon fontSize="small" /> 
        <span>AI-Enhance Career Services</span>
      </div>

      {/* HEADING */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 z-10">
        Career <span className="text-blue-500">Resources</span> & <span className="text-blue-500">Tips</span>
      </h1>
      
      {/* SUBTITLE */}
      <p className="text-gray-500 max-w-2xl mb-8 z-10">
        Expert insights, practical advice, and proven strategies to accelerate your
        career growth and job search success.
      </p>

      {/* SEARCH BAR */}
      <div className="w-full max-w-lg mb-8 z-10">
        <TextField
          fullWidth
          placeholder="Search articles..."
          variant="outlined"
          // Customizing MUI Input to match the rounded pill design
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              '& fieldset': { borderColor: '#E5E7EB' },
              '&:hover fieldset': { borderColor: '#3B82F6' },
            }
          }}
          InputProps={{
            // --- ICON: Search Icon ---
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-3 z-10">
        {filters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            clickable
            onClick={() => setActiveFilter(filter)}
            sx={{
              backgroundColor: activeFilter === filter ? '#3B82F6' : '#fff',
              color: activeFilter === filter ? '#fff' : '#4B5563',
              border: activeFilter === filter ? 'none' : '1px solid #E5E7EB',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: activeFilter === filter ? '#2563EB' : '#F3F4F6',
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogHeroSection; 