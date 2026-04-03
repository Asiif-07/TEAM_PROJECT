import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ServicesHero = () => {
  return (
    <section className="relative w-full bg-white py-24 overflow-hidden font-sans">
      
      {/* --- Background Effects (Glows) --- */}
      {/* Top Right Blue Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      {/* Bottom Left Blue Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      {/* Optional: Subtle Dot Pattern Background */}
      <div className="absolute inset-0 opacity-[0.4]" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* --- Badge Section --- */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
            
            <AutoAwesomeIcon className="text-blue-500 text-sm" fontSize="small" />
            <span className="text-sm font-medium text-blue-500 tracking-wide">
              AI-Enhance Career Services
            </span>
          </div>
        </div>

        {/* --- Main Heading --- */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Choose Your <span className="text-blue-600">Career Package</span>
        </h2>

        {/* --- Subheading --- */}
        <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-16 leading-relaxed">
          From individual services to complete career transformation packages. Select what you need to land your dream job faster.
        </p>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-gray-100 pt-10 md:border-none md:pt-0">
          
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600 mb-2">10K+</span>
            <span className="text-gray-600 font-medium">Happy Clients</span>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-green-500 mb-2">95%</span>
            <span className="text-gray-600 font-medium">Success Rate</span>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-orange-500 mb-2">35%</span>
            <span className="text-gray-600 font-medium">Avg. Salary Boost</span>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-purple-600 mb-2">4.9</span>
            <span className="text-gray-600 font-medium">Rating</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServicesHero;