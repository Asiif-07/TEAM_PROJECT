import React from 'react';
import { Clock, FileText, Sparkles, Play } from 'lucide-react';
import CvPreviewImage from '../../assets/images/heroImg.png';

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20 lg:py-24">
        {/* Changed to grid-cols-1 for mobile, md:grid-cols-2 for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900">
              Land Interviews<br />
              with an<br />
              <span className="text-blue-600">AI-Enhanced CV</span>
            </h1>
            
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Tailored by humans, supercharged by AI. Get professional CVs, cover letters, LinkedIn optimization, and interview coaching delivered fast with our expert-reviewed platform.
            </p>

            {/* Icon Features - Grid for better mobile layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-sm font-medium">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">24-48h Delivery</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-sm font-medium">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">Free Cover Letter</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-sm font-medium">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">ATS-Optimization</span>
              </div>
            </div>

            {/* Buttons - Stacked on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 px-8 py-4 text-white bg-blue-500 rounded-full font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 uppercase text-sm tracking-wide">
                Get Started Now
                <span className="text-lg">→</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 text-gray-700 bg-white border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all text-sm uppercase tracking-wide">
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </button>
            </div>

            {/* Trust Section */}
            <div className="pt-8 border-t border-blue-100 lg:border-none">
              <p className="text-xs md:text-sm text-gray-500 mb-4 uppercase font-bold tracking-widest">Trusted by Professionals</p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br ${getGradient(i)} shadow-sm`}></div>
                  ))}
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex text-yellow-400 text-sm tracking-tighter">
                    ★★★★★
                  </div>
                  <p className="text-xs text-gray-600">
                    <span className="font-bold text-slate-900">4.8</span> Trusted by 1.4m+ users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - CV Preview */}
          <div className="relative order-1 lg:order-2 flex justify-center">
            {/* Background blob for visual interest on mobile */}
            <div className="absolute -inset-4 bg-blue-100/50 rounded-full blur-3xl opacity-50"></div>
            <div className="relative w-full max-w-[500px] lg:max-w-none transform hover:scale-[1.02] transition-transform duration-500 shadow-2xl rounded-2xl overflow-hidden">
               <img 
                 src={CvPreviewImage} 
                 alt="CV Preview" 
                 className="w-full h-auto object-contain"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for the avatars
function getGradient(index) {
  const gradients = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-orange-400 to-orange-600',
    'from-green-400 to-green-600'
  ];
  return gradients[index];
}