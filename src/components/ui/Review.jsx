import React from 'react';

const reviewData = [
  // COLUMN 1
  { rating: 5, title: "Improved drastically!", content: "The dashboard gives us a clear view of tasks and deadlines, helping us deliver projects on time.", author: "James P.", role: "Software Engineer", avatar: "https://i.pravatar.cc/150?u=james" },
  { rating: 5, title: "The recurring task feature is a lifesaver!", content: "TaskHub takes care of the small details so we can focus on what matters most. Truly a productivity booster!", author: "Max", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?u=max" },
  { rating: 5, title: "Team sync is better than ever.", content: "We've tried every tool out there, but TaskHub is the only one that stuck with our engineers.", author: "Sarah L.", role: "Lead Dev", avatar: "https://i.pravatar.cc/150?u=sarah_l" },
  { rating: 5, title: "Highly recommend!", content: "The best project management tool we've used in years. Simple yet powerful.", author: "David K.", role: "CTO", avatar: "https://i.pravatar.cc/150?u=david" },

  // COLUMN 2
  { rating: 5, title: "Simple and efficient.", content: "TaskHub's intuitive design makes managing projects faster and more efficient.", author: "Zara Wynn", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?u=zara" },
  { rating: 5, title: "A game-changer for efficiency.", content: "TaskHub streamlines task management, improving project timelines and communication.", author: "Jackson", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?u=jackson" },
  { rating: 5, title: "A must-have for every growing business.", content: "TaskHub streamlines management, boosting productivity with easy tracking.", author: "Jackson Ward", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?u=ward" },
  { rating: 5, title: "Effortless collaboration.", content: "TaskHub enhances team alignment with real-time updates and efficient task boards.", author: "Liam Grant", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?u=liam" },

  // COLUMN 3
  { rating: 5, title: "Boosted our productivity!", content: "TaskHub streamlines workflows, making task delegation easy and boosting team output.", author: "Sienna Marlow", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?u=sienna" },
  { rating: 5, title: "The ultimate tool for remote teams.", content: "Ensures our remote team stays on track with real-time updates and task tracking.", author: "Jack", role: "Marketing Director", avatar: "https://i.pravatar.cc/150?u=jack" },
  { rating: 5, title: "Task management made simple.", content: "Intuitive design makes managing tasks faster and way more efficient.", author: "Lily B.", role: "Project Lead", avatar: "https://i.pravatar.cc/150?u=lily" },
  { rating: 5, title: "Outstanding Support", content: "Not only is the app great, but the support team is incredibly responsive.", author: "Emma S.", role: "Product Designer", avatar: "https://i.pravatar.cc/150?u=emma" }
];

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
            What Our <span className="text-[#2563EB]">users say</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 text-base md:text-lg leading-relaxed">
            We love when we get a feedback from our customers. This help us to work more 
            hard to build a platform which can be used by not only artists but brands as well.
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
            View all reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;