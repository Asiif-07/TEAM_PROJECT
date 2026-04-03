import React from 'react';
import { Clock, FileText, Sparkles, Play, ChevronRight } from 'lucide-react';
import CvPreviewImage from '../../assets/images/heroImg.png';

import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[90vh] bg-mesh relative overflow-hidden flex items-center">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest animate-fade-in">
              <Sparkles size={14} />
              AI-Powered Career Evolution
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-900">
              Land Your <span className="premium-text-gradient">Dream Role</span> <br />
              With Precision.
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Join 1.4M+ professionals using our elite AI to build ATS-optimized CVs, cover letters, and LinkedIn profiles that demand attention.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate('/cv-templates')}
                className="group relative flex items-center justify-center gap-3 px-10 py-5 text-white bg-slate-900 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-2xl shadow-blue-200/50"
              >
                <span>Get Started Free</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 px-10 py-5 text-slate-700 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl font-black hover:bg-white transition-all shadow-lg">
                <Play className="fill-slate-700" size={18} />
                Watch Demo
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-200/50">
              <div>
                <div className="text-2xl font-black text-slate-900">48h</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fast Delivery</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">100%</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">ATS Ready</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">4.9/5</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[550px]">
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl" />

              <div className="relative bg-white/40 backdrop-blur-xl p-4 rounded-[40px] border border-white/60 shadow-2xl transform hover:rotate-2 transition-transform duration-700">
                <img
                  src={CvPreviewImage}
                  alt="Premium CV Preview"
                  className="w-full h-auto rounded-[32px] shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

