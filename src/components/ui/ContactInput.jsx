import React from 'react';
import { User, Mail, Building2, Phone } from 'lucide-react';

const ContactInput = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-12 p-8 max-w-7xl mx-auto items-start">
      {/* Left Text Content */}
      <div className="flex-1 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          AI Enhance Career Services
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight">
          Contact <br />
          <span className="text-blue-600">Curriculum.ai</span>
        </h1>
        <p className="text-slate-500 max-w-md leading-relaxed">
          We're thrilled to connect! Contact us to learn about our products, 
          get job search tips, or make corporate inquiries anytime.
        </p>
      </div>

      {/* Right Form Card */}
      <div className="flex-1 w-full bg-[#f0f7ff] p-8 rounded-3xl border border-blue-50">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Enter your First Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="email" 
                  placeholder="Enter your Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company / School (optional)</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Enter your Company / School"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="tel" 
                  placeholder="Enter your Phone Number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">How can we help?</label>
            <textarea 
              placeholder="Enter Message Here"
              rows="4"
              className="w-full p-4 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button className="bg-[#1a73e8] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-blue-200">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactInput;
