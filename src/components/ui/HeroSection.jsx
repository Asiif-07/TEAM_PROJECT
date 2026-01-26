import React from 'react';
import { Clock, FileText, Sparkles, Play } from 'lucide-react';
import CvPreviewImage from '../../assets/images/heroImg.png';

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
     

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Land Interviews<br />
              with an<br />
              <span className="text-blue-600">AI-Enhanced CV</span>
            </h1>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Tailored by humans, supercharged by AI. Get professional CVs, cover letters, LinkedIn optimization, and interview coaching delivered fast with our expert-reviewed platform.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">24-48 Delivery</span>
                <FileText className="w-5 h-5 text-blue-600 ml-4" />
                <span className="text-gray-700">Free Cover Letter Included with every CV</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">ATS-Optimization</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex items-center gap-2 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-lg">
                Get Start Now
                <span className="text-lg">→</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>

            {/* Trust Section */}
            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-3">Trusted by Professionals</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex text-yellow-400 text-sm">
                    ★★★★★
                  </div>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">4.8</span> Trusted by 1.4m+ users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - CV Preview */}
          <div className="relative">
                <img src={CvPreviewImage} alt="CV Preview" />
          </div>
        </div>
      </div>
    </div>
  );
}