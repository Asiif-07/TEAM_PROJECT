import React from 'react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

const ContactCard = () => {
  const cardData = [
    {
      icon: <Mail className="w-5 h-5 text-slate-600" />,
      title: "Email Us",
      sub: "Quick response guaranteed",
      action: <a href="mailto:hello@curriculum.ai.com" className="text-[#1a73e8] text-xs font-bold hover:underline">hello@curriculum.ai.com</a>
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-slate-600" />,
      title: "Live Chat",
      sub: "Instant Support available",
      btn: "Start Chat"
    },
    {
      icon: <Phone className="w-5 h-5 text-slate-600" />,
      title: "Book a Call",
      sub: "Free consultation to discuss your needs",
      btn: "Schedule Call"
    }
  ];

  return (
    <section className="max-w-5xl mx-auto px-5 pb-20 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardData.map((item, idx) => (
          <div 
            key={idx} 
            className="relative overflow-hidden bg-[#f8fbff] rounded-[24px] p-8 border border-slate-50 flex flex-col items-center text-center shadow-sm"
          >
            {/* Bottom-Right Corner Gradient */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-blue-100/60 rounded-full blur-2xl -z-0" />

            <div className="relative z-10 w-12 h-12 bg-[#eef2f6] rounded-full flex items-center justify-center mb-5">
              {item.icon}
            </div>
            
            <h3 className="relative z-10 text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
            <p className="relative z-10 text-slate-500 text-[13px] mb-8 max-w-[180px]">
              {item.sub}
            </p>

            <div className="relative z-10 w-full mt-auto">
              {item.btn ? (
                <button className="w-full py-2.5 border border-blue-300 rounded-lg text-[#1a73e8] font-bold text-xs bg-white/40 hover:bg-blue-50 transition-colors">
                  {item.btn}
                </button>
              ) : (
                item.action
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactCard;