import React from "react";
import svgIcon from "../../assets/images/svg.png"; 

const services = [
  {
    title: "CV Writing",
    price: "From $ 49",
    desc: "Professional CV tailored to your industry and career level",
    features: ["ATS-Optimized", "Industry-Specific", "24h Delivery", "Unlimited Revisions"],
    dark: false,
  },
  {
    title: "LinkedIn Optimization",
    price: "From $ 69",
    desc: "Professional CV tailored to your industry and career level",
    features: ["ATS-Optimized", "Industry-Specific", "24h Delivery", "Unlimited Revisions"],
    dark: false,
  },
  {
    title: "Cover Letter",
    price: "From $ 89",
    desc: "Professional CV tailored to your industry and career level",
    features: [
      "ATS-Optimized", "Industry-Specific", "24h Delivery", "Unlimited Revisions",
      "Professional Formatting", "Custom Templates", "Interview Coaching", "Keyword Optimization"
    ],
    dark: true,
  },
];

export default function Services() {
  return (
    <section className="w-full flex flex-col items-center justify-center px-4 py-16 bg-[#F9FAFB]">
      
      {/* Heading */}
      {/* FIX: Increased mb-20 to ensure the card has room to "pop" upward without touching the text */}
      <div className="text-center max-w-xl mb-20">
        <h2 className="font-[Onest] font-bold text-[40px] tracking-tight text-[#101828]">
          Our <span className="text-[#2E70FF]">Services</span>
        </h2>
        <p className="mt-2 font-[Inter] text-[15px] text-[#475467]">
          Choose from our range of AI-enhanced career services.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-6 items-center max-w-[1200px] w-full">
        {services.map((item, idx) => (
          <div
            key={idx}
            style={item.dark ? {
              boxShadow: "20px -35px 200px -19px #00D0FF1C inset, -95px -22px 100px -49px #AB03FF33 inset",
            } : {
              boxShadow: "0px 8px 12px -4px rgba(16, 24, 40, 0.04)",
            }}
            className={`
              relative w-[330px] rounded-[24px] transition-all duration-300 border
              
              /* SHORTER: Reduced padding to p-5 and height to h-fit */
              p-5 flex flex-col h-fit

              ${item.dark 
                ? "bg-[#111827] border-[#1F2937] text-white z-10 scale-105 hover:scale-110 hover:-translate-y-6 hover:shadow-3xl cursor-pointer" 
                : "bg-gradient-to-b from-[#F0F7FF] to-[#FFFFFF] border-[#E5E7EB] text-[#101828]"
              }
            `}
          >
            {/* Icon */}
            {/* SHORTER: Reduced icon size and margin */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${item.dark ? "bg-[#7DD3FC20] border border-[#7DD3FC40]" : "bg-[#D1E9FF]"}`}>
               <div className={`w-4 h-4 flex items-center justify-center rounded-full ${item.dark ? "bg-[#7DD3FC]" : "bg-[#B2DDFF]"}`}>
                  <img src={svgIcon} alt="icon" className="w-2 h-2 brightness-0 invert" />
               </div>
            </div>

            {/* Title & Desc */}
            {/* SHORTER: Reduced title font size and description margin */}
            <h3 className="font-[Onest] font-bold text-[22px] mb-1">{item.title}</h3>
            <p className={`text-[12px] leading-relaxed mb-3 border-b pb-3 ${item.dark ? "text-gray-400 border-gray-700" : "text-[#475467] border-gray-100"}`}>
              {item.desc}
            </p>

            {/* SHORTER: Reduced price margin */}
            <p className="font-[Onest] font-bold text-[24px] mb-3">{item.price}</p>

            {/* Features List */}
            {/* SHORTER: Reduced list spacing from space-y-2.5 to space-y-2 */}
            <ul className="space-y-2 mb-5">
              {item.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[12px]">
                  <div className={`min-w-[16px] h-[16px] rounded-full flex items-center justify-center ${item.dark ? "bg-white" : "bg-[#EFF8FF]"}`}>
                    <svg width="8" height="8" viewBox="0 0 14 14" fill="none">
                      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" 
                        stroke={item.dark ? "#111827" : "#2E70FF"} 
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className={item.dark ? "text-gray-300" : "text-[#475467]"}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            {/* SHORTER: Reduced button padding */}
            <button className={`w-full py-2.5 rounded-xl font-bold text-[13px] transition-all
              ${item.dark ? "bg-[#2E70FF] text-white hover:bg-blue-600" : "bg-[#1570EF] text-white hover:bg-blue-700"}
            `}>
              Get started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}