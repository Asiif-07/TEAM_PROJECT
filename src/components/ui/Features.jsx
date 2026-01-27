const data = [
    { title: "AI + Human Touch", text: "Advanced AI analysis combined with expert human refinement for perfect results." },
    { title: "Fast Turnaround", text: "Get your professional documents delivered within 24–48 hours guaranteed." },
    { title: "GDPR Compliant", text: "Your data is secure and protected with enterprise-grade security measures." },
    { title: "ATS-Optimized", text: "Your resume and cover letter are optimized to pass Applicant Tracking Systems (ATS) and get noticed by recruiters." },
    { title: "Quality Guarantee", text: "Enjoy unlimited revisions to ensure every detail meets your expectations—perfection is the only goal." },
  ];
  
  export default function Features() {
    return (
      <section className="max-w-[1293px] mx-auto p-8 ">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-[32px]">
          
          {data.map((item, i) => (
            <div 
              key={i} 
              className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-[10px]
                ${i < 3 ? "md:col-span-2" : "md:col-span-3"}`}
            >
              <div className="bg-blue-50 p-2 rounded-lg mb-6">
                <img src="/src/assets/images/Background.jpg" alt="icon" className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{item.text}</p>
              
              <button className="mt-auto text-blue-500 text-sm font-semibold flex items-center hover:gap-2 transition-all">
                Learn more about all features <span className="ml-1">→</span>
              </button>
            </div>
          ))}
  
        </div>
      </section>
    );
  }