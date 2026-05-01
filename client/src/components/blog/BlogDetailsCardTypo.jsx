import React from "react";
import toast from "react-hot-toast";
import { Avatar, Button, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import typoPic from "../../assets/blogDetailsPic/Container.png";

const BlogDetailsCardTypo = ({ blog }) => {
  if (!blog) return null;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* =========================================================
            1. HERO IMAGE SECTION
           ========================================================= */}
        <div className="w-full h-[400px] md:h-[500px] mb-8 overflow-hidden rounded-3xl shadow-lg">
          <img
            src={blog.coverImage || typoPic}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* =========================================================
            2. META DATA & SOCIAL BAR
           ========================================================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-10 gap-6">
          {/* LEFT: Author & Date */}
          <div className="flex items-center gap-12">
            {/* Author */}
            <div className="flex flex-col gap-1">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wide">
                Written by
              </span>
              <div className="flex items-center gap-2">
                <Avatar
                  src={blog.author?.avatar || "https://i.pravatar.cc/150?img=9"}
                  alt={blog.author?.name}
                  sx={{ width: 24, height: 24 }}
                />
                <span className="text-gray-900 font-semibold text-sm">
                  {blog.author?.name || "Anonymous"}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wide">
                Published on
              </span>
              <span className="text-gray-900 font-semibold text-sm">
                {formattedDate}
              </span>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <span className="text-blue-600 text-xs font-bold uppercase tracking-wide">
                Category
              </span>
              <span className="text-gray-900 font-semibold text-sm">
                {blog.category?.name || "General"}
              </span>
            </div>
          </div>

          {/* RIGHT: Social Share Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              sx={{
                textTransform: "none",
                borderColor: "#E5E7EB",
                color: "#4B5563",
                fontSize: "0.875rem",
                borderRadius: "8px",
                padding: "6px 16px",
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Copy link
            </Button>

            {/* Social Icons with light gray borders */}
            {[
              <TwitterIcon />,
              <FacebookIcon />,
              <LinkedInIcon />,
              <WhatsAppIcon />,
            ].map((icon, index) => (
              <IconButton
                key={index}
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "8px",
                  color: "#4B5563",
                  "&:hover": {
                    backgroundColor: "#F9FAFB",
                    borderColor: "#D1D5DB",
                  },
                }}
              >
                {React.cloneElement(icon, { sx: { fontSize: 20 } })}
              </IconButton>
            ))}
          </div>
        </div>

        {/* =========================================================
            3. MAIN CONTENT GRID
           ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- LEFT COLUMN: CONTENT (Span 8) --- */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>

            <div
              className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR (Span 4) --- */}
          <div className="hidden lg:block lg:col-span-4 pl-8">
            <div className="sticky top-10 border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
              <h3 className="text-gray-900 font-bold text-lg mb-6">
                About the Author
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  src={blog.author?.avatar || "https://i.pravatar.cc/150?img=9"}
                  sx={{ width: 64, height: 64 }}
                />
                <div>
                  <h4 className="font-bold text-gray-900">{blog.author?.name}</h4>
                  <p className="text-sm text-gray-500">{blog.author?.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Expert in {blog.category?.name || "Career Advancement"} and professional development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsCardTypo;
