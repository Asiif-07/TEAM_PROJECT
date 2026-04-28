import React, { useState } from 'react';
import { User, Mail, Building2, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ContactInput = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = true;
    if (!formData.message.trim()) newErrors.message = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Mock submission
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', phone: '', message: '' });
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{t("Message Sent!")}</h2>
        <p className="text-slate-600">{t("Contact Success Msg") || "Thank you for reaching out. We will get back to you shortly."}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-blue-600 font-semibold hover:underline"
        >
          {t("Send Another Message")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 p-8 max-w-7xl mx-auto items-start">
      {/* Left Text Content */}
      <div className="flex-1 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">
          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          {t("AI Features")}
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight">
          {t("Contact")} <br />
          <span className="text-blue-600">CareerForge.AI</span>
        </h1>
        <p className="text-slate-500 max-w-md leading-relaxed">
          {t("Contact Subtext")}
        </p>
      </div>

      {/* Right Form Card */}
      <div className="flex-1 w-full bg-[#f0f7ff] p-8 rounded-3xl border border-blue-50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">{t("Your Full Name")}</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.name ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your First Name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 focus:ring-2 outline-none transition-all ${errors.name ? 'ring-red-400 focus:ring-red-500' : 'ring-slate-200 focus:ring-blue-500'}`}
                />
              </div>
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">{t("Email Address")}</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 focus:ring-2 outline-none transition-all ${errors.email ? 'ring-red-400 focus:ring-red-500' : 'ring-slate-200 focus:ring-blue-500'}`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">{t("Company Optional")}</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your Company / School"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">{t("Phone Optional")}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your Phone Number"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t("How Help")}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter Message Here"
              rows="4"
              className={`w-full p-4 rounded-xl border-none ring-1 focus:ring-2 outline-none transition-all resize-none ${errors.message ? 'ring-red-400 focus:ring-red-500' : 'ring-slate-200 focus:ring-blue-500'}`}
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-[#1a73e8] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            {t("Send Message")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactInput;
