import { 
  Button, 
  Avatar, 
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import blogimg from "../../assets/blogsPics/img1.png";

const BlogArticleCard = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        
        {/* LEFT IMAGE SECTION */}
        <div className="w-full lg:w-1/2 relative">
           {/* Placeholder image resembling the resume flat lay */}
          <img 
            src={blogimg} 
            alt="Resume flat lay" 
            className="w-full h-[400px] object-cover rounded-2xl shadow-sm"
          />
          {/* Decorative graphic elements could go here */}
        </div>

        {/* RIGHT CONTENT SECTION */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          
          {/* Category Tag */}
          <div className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold tracking-wide uppercase mb-4">
            CV Writing
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            10 CV Mistakes That Are Killing Your Job Applications
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-lg mb-6 leading-relaxed">
            Discover the most common CV mistakes that recruiters see every day and learn
            how to avoid them to increase your interview chances. Stand out from the crowd
            with expert-backed tips for a polished, professional resume.
          </p>

          {/* Meta Data (Author, Date, Time) */}
          <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar 
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
                alt="Sarah Jonson" 
                sx={{ width: 32, height: 32 }}
              />
              <span className="font-semibold text-gray-900">Sarah Jonson</span>
            </div>
            
            {/* Date - ICON: Calendar Icon */}
            <div className="flex items-center gap-1.5">
              <CalendarTodayIcon fontSize="inherit" />
              <span>7 Jul 2025</span>
            </div>

            {/* Read Time - ICON: Clock Icon */}
            <div className="flex items-center gap-1.5">
              <AccessTimeIcon fontSize="inherit" />
              <span>5 min read</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            variant="contained" 
            size="large"
            disableElevation
            endIcon={<ArrowForwardIcon />} /* --- ICON: Arrow Icon --- */
            sx={{
              textTransform: 'none',
              backgroundColor: '#3B82F6',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#2563EB',
              }
            }}
          >
            Read Article
          </Button>

        </div>
      </div>
    </div>
  );
};

export default BlogArticleCard;