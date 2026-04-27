import React from 'react';
import { useTranslation } from 'react-i18next';


const ReviewCard = ({ data }) => (
  <div 
    style={{ height: '330px' }} 
    className="bg-[#FAF7F2] p-6 pt-10 rounded-[2.5rem] border border-[#F3E8E2] shadow-sm mb-6 flex flex-col justify-between relative z-0"
  >
    <div>
      <div className="flex gap-1 mb-4">
        {[...Array(data.rating)].map((_, i) => (
          <svg key={i} className="w-5 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <h4 className="text-xl font-bold text-gray-900 mb-0.5 leading-tight">
        {data.title}
      </h4>
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
        {data.content}
      </p>
    </div>

    <div className="flex items-center gap-3">
      <img 
        src={data.avatar} 
        alt={data.author} 
        className="w-10 h-10 rounded-full grayscale object-cover" 
      />
      <div>
        <p className="text-sm font-bold text-gray-900">{data.author}</p>
        <p className="text-xs text-gray-400 font-medium">{data.role}</p>
      </div>
    </div>
  </div>
);

const Review = () => {
  const { t } = useTranslation();
  const reviewData = [
    // COLUMN 1
    { rating: 5, title: t("Rating 1.Title"), content: t("Rating 1.Content"), author: "James P.", role: t("Roles.VP Engineering"), avatar: "https://i.pravatar.cc/150?u=james" },
    { rating: 5, title: t("Rating 2.Title"), content: t("Rating 2.Content"), author: "Max", role: t("Roles.VP Marketing"), avatar: "https://i.pravatar.cc/150?u=max" },
    { rating: 5, title: t("Rating 3.Title"), content: t("Rating 3.Content"), author: "Sarah L.", role: "Lead Dev", avatar: "https://i.pravatar.cc/150?u=sarah_l" },
    { rating: 5, title: t("Rating 4.Title"), content: t("Rating 4.Content"), author: "David K.", role: t("Roles.CTO"), avatar: "https://i.pravatar.cc/150?u=david" },
  
    // COLUMN 2
    { rating: 5, title: t("Rating 5.Title"), content: t("Rating 5.Content"), author: "Zara Wynn", role: t("Roles.VP Marketing"), avatar: "https://i.pravatar.cc/150?u=zara" },
    { rating: 5, title: t("Rating 6.Title"), content: t("Rating 6.Content"), author: "Jackson", role: t("Roles.VP Marketing"), avatar: "https://i.pravatar.cc/150?u=jackson" },
    { rating: 5, title: t("Rating 7.Title"), content: t("Rating 7.Content"), author: "Jackson Ward", role: t("Roles.VP Marketing"), avatar: "https://i.pravatar.cc/150?u=ward" },
    { rating: 5, title: t("Rating 8.Title"), content: t("Rating 8.Content"), author: "Liam Grant", role: t("Roles.VP Marketing"), avatar: "https://i.pravatar.cc/150?u=liam" },
  
    // COLUMN 3
    { rating: 5, title: t("Rating 9.Title"), content: t("Rating 9.Content"), author: "Sienna Marlow", role: t("Roles.VP Marketing"), avatar: "https://i.pravatar.cc/150?u=sienna" },
    { rating: 5, title: t("Rating 10.Title"), content: t("Rating 10.Content"), author: "Jack", role: t("Roles.VP Marketing"), avatar: "https://i.pravatar.cc/150?u=jack" },
    { rating: 5, title: t("Rating 11.Title"), content: t("Rating 11.Content"), author: "Lily B.", role: "Project Lead", avatar: "https://i.pravatar.cc/150?u=lily" },
    { rating: 5, title: t("Rating 12.Title"), content: t("Rating 12.Content"), author: "Emma S.", role: "Product Designer", avatar: "https://i.pravatar.cc/150?u=emma" }
  ];
  const col1 = reviewData.slice(0, 4);
  const col2 = reviewData.slice(4, 8);
  const col3 = reviewData.slice(8, 12);

  return (
    <div className="bg-white">
      {/* 1. HEADER DIV */}
      <div className="relative pt-20 pb-10 overflow-hidden">
        {/* Figma Dotted Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.4] pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`, 
            backgroundSize: '24px 24px' 
          }} 
        />
        
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            {t("What Our")} <span className="text-[#2563EB]">{t("users say")}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 text-base md:text-lg leading-relaxed">
            {t("Reviews Subtext")}
          </p>
        </div>
      </div>

      {/* 2. GRID DIV */}
      <div className="relative pb-48 overflow-hidden">
        {/* Top Fade Mist */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-white via-white/80 to-transparent" />
        
        {/* Bottom Fade Mist */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-140 bg-gradient-to-t from-white via-white to-transparent" />

        <section className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {/* Column 1 */}
            <div className="flex flex-col">
              {col1.map((item, idx) => <ReviewCard key={`col1-${idx}`} data={item} />)}
            </div>

            {/* Column 2 (Interlocked / Staggered) */}
            <div className="flex flex-col md:-mt-20">
              {col2.map((item, idx) => <ReviewCard key={`col2-${idx}`} data={item} />)}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col">
              {col3.map((item, idx) => <ReviewCard key={`col3-${idx}`} data={item} />)}
            </div>
          </div>
        </section>

        {/* Floating View All Button */}
        <div className="absolute bottom-47 left-1/2 -translate-x-1/2 z-[60]">
          <button className="bg-[#2563EB] text-white px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
            {t("View All Reviews")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;