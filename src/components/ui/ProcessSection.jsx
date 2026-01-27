import React from 'react';

// Reusable Banner Component
const Banner = ({ 
  stepLabel, 
  title, 
  titleAccent, 
  text, 
  image, 
  buttonText, 
  imageLeft, 
  themeColor, 
  accentText, 
  extraContent,
}) => {
  return (
    <div className="mx-auto px-6 py-16 lg:py-24 relative" style={{ maxWidth: '1280px' }}>
      <div className={`flex flex-col md:flex-row items-center gap-16 lg:gap-32 ${imageLeft ? "md:flex-row-reverse" : ""}`}>
        
        {/* Text Content */}
        <div className="flex-1 space-y-8 text-left">
          {/* Step Label with Icon */}
          <div className={`flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.3em] ${accentText}`}>
            <span className="p-2 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </span>
            {stepLabel}
          </div>

          {/* Title */}
          <h2 className="text-4xl lg:text-[52px] font-[900] text-slate-900 leading-[1.1] tracking-tight">
            {title} <br />
            <span className={accentText}>{titleAccent}</span>
          </h2>

          {/* Description */}
          <p className="text-[17px]    leading-relaxed max-w-lg font-medium">
            {text}
          </p>

          {/* THE FIXED BUTTON: Border matches theme color */}
          <button className={`
            px-10 py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300
            bg-transparent border-[1.5px]
            ${accentText} /* Text color matches theme */
            ${themeColor} /* Border color and hover effects */
          `}>
            {buttonText}
          </button>

          {/* Subscription Box - Precise Figma Match */}
          {extraContent && (
            <div className="mt-10 p-7 bg-[#FFF5F9] border border-[#FFD6E8] rounded-[2.5rem] max-w-[360px] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#E91E63] font-bold text-xs uppercase tracking-wider">
                <span className="text-base">💎</span>
                Subscription Option
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-[#E91E63]"></span>
                  $4.00/month
                </li>
                <li className="flex items-start gap-3 text-xs font-medium text-slate-500 leading-snug">
                  <span className="w-2 h-2 rounded-full bg-[#FFD6E8] mt-1 shrink-0"></span>
                  Unlimited revisions for your CV & Cover letter
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Image Content */}
        <div className="flex-1 relative">
          <div className={`absolute -inset-10 rounded-full blur-[100px] opacity-[0.15] -z-10 
            ${accentText.includes('blue') ? 'bg-blue-600' : ''} 
            ${accentText.includes('green') ? 'bg-green-600' : ''} 
            ${accentText.includes('orange') ? 'bg-orange-600' : ''} 
            ${accentText.includes('pink') ? 'bg-pink-600' : ''}`} 
          />
          
          <div className="relative group">
            <div className="rounded-[3rem] lg:rounded-[4rem] p-3 lg:p-5 bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]">
              <div className="rounded-[2rem] lg:rounded-[3rem] overflow-hidden">
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessSection = () => {
  return (
    <section className="bg-[#FCFDFF] py-24 overflow-hidden">
      {/* Header Area */}
      <div className="text-center mb-10 px-6">
         <h2 className="text-5xl md:text-6xl font-[950] text-slate-900 mb-6 tracking-tight">
           How <span className="text-blue-600 font-normal">It works</span>
         </h2>
         <p className=" max-w-lg mx-auto text-lg font-medium leading-relaxed">
           Quickly upload, customize, and download your resume tailored to any job description in no time.
         </p>
      </div>

      <Banner 
        stepLabel="STEP 1"
        title="Choose Your"
        titleAccent="Service & Package"
        text="Browse our comprehensive range of AI-enhanced career services and select the perfect package for your career goals."
        image="/src/assets/images/banner/673b1186892be17ee3fd3c50_res1.webp (1).png"
        buttonText="CHOOSE SERVICE"
        imageLeft={false}
        accentText="text-blue-600"
        themeColor="border-blue-600 hover:bg-blue-600 hover:text-white"
      />

      <Banner 
        stepLabel="AI ANALYSIS"
        title="AI Analysis &"
        titleAccent="Intelligent Processing"
        text="Our advanced AI system analyzes your information, industry requirements, and target job descriptions to create optimized content."
        image="/src/assets/images/banner/673b128a0b7a6d75befd50b2_res2.webp.png"
        buttonText="AI ANALYSIS"
        imageLeft={true}
        accentText="text-green-600"
        themeColor="border-green-600 hover:bg-green-600 hover:text-white"
      />

      <Banner 
        stepLabel="CUSTOMIZATION"
        title="Expert Human Review &"
        titleAccent="Refinement"
        text="Industry professionals with deep sector knowledge review and refine the AI-generated content, ensuring perfect tone and clarity."
        image="/src/assets/images/banner/673b128a8eea3105e427c227_res3.webp.png"
        buttonText="HUMAN REVIEW"
        imageLeft={false}
        accentText="text-orange-500"
        themeColor="border-orange-500 hover:bg-orange-500 hover:text-white"
      />

      <Banner 
        stepLabel="QUALITY DELIVERY"
        title="Quality Delivery &"
        titleAccent="Ongoing Support"
        text="Receive your professionally-crafted documents with detailed feedback, plus unlimited revisions and ongoing support."
        image="/src/assets/images/banner/673b128acbeb5118a12ab056_res4.webp.png"
        buttonText="DELIVERED FAST"
        imageLeft={true}
        accentText="text-pink-500"
        themeColor="border-pink-500 hover:bg-pink-500 hover:text-white"
        extraContent={true}
      />  
    </section>
  );
};

export default ProcessSection;