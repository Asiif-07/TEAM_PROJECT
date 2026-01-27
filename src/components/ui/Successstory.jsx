import React from 'react';

const SuccessStories = () => {
  const stories = [
    { type: 'metric', color: 'bg-[#FEF9C3]', val: '94%', label: 'Success Rate' },
    { type: 'metric', color: 'bg-[#DCFCE7]', val: '2.1 weeks', label: 'Avg. Time to Hire' },
    { type: 'quote', color: 'bg-[#F9FAFB]', text: '"Amplemarket has helped revive our pipeline and create over €2M in business opportunities, with late six digits in wondeals. All in just 10 months!"', author: 'Giuseppe Colucci', role: 'Senior VP of Growth' },
    { type: 'quote', color: 'bg-[#F9FAFB]', text: '"Amplemarket has helped revive our pipeline and create over €2M in business opportunities..."', author: 'Giuseppe Colucci', role: 'Senior VP of Growth' },
    { type: 'metric', color: 'bg-[#FEF08A]', val: '94%', label: 'Success Rate' },
    { type: 'metric', color: 'bg-[#FCE7F3]', val: '2.1 weeks', label: 'Avg. Time to Hire' },
    { type: 'metric', color: 'bg-[#E0E7FF]', val: '94%', label: 'Success Rate' },
    { type: 'metric', color: 'bg-[#F3E8FF]', val: '2.1 weeks', label: 'Avg. Time to Hire' },
    { type: 'quote', color: 'bg-[#F9FAFB]', text: '"Amplemarket has helped revive our pipeline and create over €2M in business opportunities..."', author: 'Giuseppe Colucci', role: 'Senior VP of Growth' },
  ];

  return (
    <section className="bg-white py-20 relative">
      
      {/* 1st DIV: HEADER */}
      <div className="max-w-6xl mx-auto px-6 mb-16 text-center relative z-30">
        <img 
          src="/src/assets/images/succes.png" 
          alt="Success annotation" 
          className="absolute -left-5 -bottom-30 w-36 md:w-58 pointer-events-none select-none drop-shadow-sm"
        />
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
          Success <span className="text-blue-600">Stories</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-base">
          Choose from our comprehensive range of AI-enhanced career services designed to accelerate your job search success.
        </p>
      </div>

      {/* 2nd DIV: CONTENT GRID */}
      <div className="relative py-12 px-6 z-10 overflow-hidden">
        
        {/* Background Dot Grid */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#475569 0.8px, transparent 0.8p)`, backgroundSize: '30px 30px' }} />

        {/* Top-Left & Bottom-Right Gradients (#B8DBFE) */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#B8DBFE] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#B8DBFE] rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 opacity-60 pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-5 relative z-10">
          {stories.map((item, idx) => (
            <div 
              key={idx}
              className={`p-7 rounded-[2.2rem] flex flex-col justify-between relative transition-transform hover:scale-[1.01] border border-black/5 shadow-sm overflow-hidden
                ${item.color} 
                ${item.type === 'quote' ? 'md:col-span-2' : 'md:col-span-1'}`}
            >
              {item.type === 'metric' ? (
                <div className="flex flex-col h-full">
                  {/* Container for Frame 72.png - styled to spread across the top */}
                  <div className="w-full mb-10">
                    <img 
                      src="/src/assets/images/Frame 72.png" 
                      alt="Metric Icons" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  <div className="mt-auto">
                    <div className="text-5xl font-medium max-h-[242px] text-slate-900 tracking-tighter">
                      {item.val}
                    </div>
                    <div className="text-slate-700 text-sm font-semibold mt-1">
                      {item.label}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-800 text-lg font-medium leading-relaxed mb-10">
                    {item.text}
                  </p>
                  <div className="flex items-center justify-between pt-5 border-t border-black/5">
                    <div className="flex items-center gap-3">
                      <img src="/src/assets/images/testimonial-storylake.png" alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.author}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.role}</div>
                      </div>
                    </div>
                    <img src="/src/assets/images/Storylake logo.png" alt="" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;