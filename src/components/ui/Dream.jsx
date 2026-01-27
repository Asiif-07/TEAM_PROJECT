import React from 'react';
import shield from "../../assets/images/shield.png";
import vector from "../../assets/images/vector.png";
import timer from "../../assets/images/timer.png";

const Dream = () => {
  return (
    <section 
  
      className="w-full py-20 mb-8 px-4 flex flex-col items-center justify-center text-center"
      style={{ 
        background: 'linear-gradient(90deg, #00C8FF17 9%, #AEADFF26 15%)' 
      }}
    >
      {/* Heading */}
      <h2 className="text-[#101828] text-3xl md:text-4xl font-bold mb-4">
        Ready to Land Your Dream Job?
      </h2>

      {/* Description */}
      <p className="text-[#475467] max-w-2xl text-base md:text-lg mb-10 leading-relaxed">
        Join thousands of professionals who have accelerated their careers with our AI-enhanced CV and career services. Get started today and see results fast.
      </p>

      {/* Feature Icons Row */}
      <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-12">
        <div className="flex items-center gap-2">
          <img src={timer} alt="Timer" className="w-5 h-5 object-contain" />
          <span className="text-[#667085] text-sm font-medium">24-48 Delivery</span>
        </div>
        
        <div className="flex items-center gap-2">
          <img src={shield} alt="Shield" className="w-5 h-5 object-contain" />
          <span className="text-[#667085] text-sm font-medium">Money-back Guarantee</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={vector} alt="Vector" className="w-5 h-5 object-contain" />
          <span className="text-[#667085] text-sm font-medium">Unlimited Revisions</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
       
        <button 
          className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95"
          style={{ 
            background: 'linear-gradient(90deg, #7CC5E6 0%, #1570EF 100%)' 
          }}
        >
          Get Start Now
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.3335 10H16.6668M16.6668 10L11.6668 5M16.6668 10L11.6668 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* View Pricing Button */}
        <button className="px-8 py-3 bg-white text-[#344054] font-semibold rounded-lg border border-[#D0D5DD] shadow-sm hover:bg-gray-50 transition-all active:scale-95">
          View Pricing
        </button>
      </div>
    </section>
  );
};

export default Dream;