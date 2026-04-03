import React from 'react';
import { Button, Avatar, AvatarGroup, Rating } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Sparkle Icon
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Arrow Icon

// ==========================================
// REUSABLE HERO COMPONENT
// ==========================================
const BlogDetailsHero = ({
  badgeText = "AI-Enhance Career Services",
  titlePart1 = "How to Optimize Your",
  titleHighlight = "LinkedIn Profile", // The blue text
  titlePart2 = "for Recruiters",
  subtitle = "A step-by-step guide to creating a LinkedIn profile that attracts recruiters and opens doors to new opportunities.",
  buttonText = "Get Start Now",
  rating = 4.8,
  reviewCount = "1.4m+",
  trustedLabel = "Trusted by Professionals"
}) => {
  return (
    <div className="relative w-full bg-white pt-24 pb-20 flex flex-col items-center text-center px-4 overflow-hidden font-sans">
      
      {/* 1. BACKGROUND DECORATION (The Blue Glow) */}
      {/* Positioned top-right to match the screenshot */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/80 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/4"></div>

      {/* 2. TOP BADGE (Pill) */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs md:text-sm font-semibold mb-8 z-10 border border-blue-100">
        <AutoAwesomeIcon sx={{ fontSize: 16 }} /> 
        <span>{badgeText}</span>
      </div>

      {/* 3. MAIN HEADING */}
      <h1 className="max-w-4xl text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight z-10 tracking-tight">
        {titlePart1}{' '}
        <span className="text-blue-600 inline-block">{titleHighlight}</span>{' '}
        {titlePart2}
      </h1>
      
      {/* 4. SUBTITLE */}
      <p className="max-w-2xl text-gray-500 text-base md:text-lg mb-10 leading-relaxed z-10">
        {subtitle}
      </p>

      {/* 5. CTA BUTTON */}
      <div className="z-10 mb-10">
        <Button 
          variant="contained" 
          size="large"
          disableElevation
          endIcon={<ArrowForwardIcon />}
          sx={{
            textTransform: 'none',
            backgroundColor: '#3B82F6', // Tailwind blue-500
            padding: '12px 32px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)', // Custom blue glow shadow
            '&:hover': {
              backgroundColor: '#2563EB', // Tailwind blue-600
              boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.23)',
            }
          }}
        >
          {buttonText}
        </Button>
      </div>

      {/* 6. TRUST / SOCIAL PROOF SECTION */}
      <div className="flex flex-col items-center gap-3 z-10">
        
        {/* Label */}
        <span className="text-gray-500 text-sm font-medium">
          {trustedLabel}
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          
          {/* Avatar Group */}
          <AvatarGroup 
            max={5}
            sx={{
              '& .MuiAvatar-root': { 
                width: 32, 
                height: 32, 
                fontSize: 12,
                borderColor: '#fff',
                borderWidth: 2 
              }
            }}
          >
            <Avatar alt="User 1" src="https://i.pravatar.cc/150?img=1" />
            <Avatar alt="User 2" src="https://i.pravatar.cc/150?img=5" />
            <Avatar alt="User 3" src="https://i.pravatar.cc/150?img=8" />
            <Avatar alt="User 4" src="https://i.pravatar.cc/150?img=12" />
            <Avatar alt="User 5" src="https://i.pravatar.cc/150?img=32" />
          </AvatarGroup>

          {/* Rating Stars & Text */}
          <div className="flex items-center gap-2">
            <Rating 
              name="read-only" 
              value={5} 
              readOnly 
              size="small" 
              sx={{ color: '#FBBF24' }} // Tailwind amber-400 color
            />
            <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
              <span>{rating}</span>
              <span className="font-normal text-gray-500 text-xs">
                Trusted by {reviewCount} users
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};


export default BlogDetailsHero;




