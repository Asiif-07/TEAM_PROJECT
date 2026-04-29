import React from "react";
import { FileText, Linkedin, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getServices = (t) => [
  {
    id: "CV Writing",
    title: t("CV Writing"),
    price: `${t("From Price")} 49`,
    desc: t("CV Writing Desc"),
    features: [t("ATS-Optimized"), t("Industry-Specific"), t("24h Delivery"), t("Unlimited Revisions")],
    dark: false,
    icon: FileText,
  },
  {
    id: "LinkedIn Optimization",
    title: t("LinkedIn Optimization"),
    price: `${t("From Price")} 69`,
    desc: t("CV Writing Desc"),
    features: [t("ATS-Optimized"), t("Industry-Specific"), t("24h Delivery"), t("Unlimited Revisions")],
    dark: false,
    icon: Linkedin,
  },
  {
    id: "Cover Letter Service",
    title: t("Cover Letter Service"),
    price: `${t("From Price")} 89`,
    desc: t("CV Writing Desc"),
    features: [
      t("ATS-Optimized"), t("Industry-Specific"), t("24h Delivery"), t("Unlimited Revisions"),
      t("Professional Formatting"), t("Custom Templates"), t("Interview Coaching"), t("Keyword Optimization")
    ],
    dark: false,
    icon: Mail,
  },
];


import { useState } from "react";
import toast from "react-hot-toast";
import { createCheckoutSession } from "../../api/stripe";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Services() {
  const { t } = useTranslation();
  const services = getServices(t);
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ping the server on mount to wake it up if it's sleeping (Render cold start)
    // This reduces delay when the user finally clicks "Get Started"
    const pingServer = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/health`);
      } catch {
        // Silent catch: if ping fails, the actual request will handle errors
      }
    };
    pingServer();
  }, []);

  const handleSubscribe = async (planTitle) => {
    if (!isAuthenticated) {
      toast.error(t("Please login to subscribe"));
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const res = await createCheckoutSession({ planTitle, accessToken, refreshAccessToken });
      if (res && res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      toast.error(error.message || t("Failed to initiate payment"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center px-4 py-16 bg-[#F9FAFB]">

      {/* Heading */}
      {/* FIX: Increased mb-20 to ensure the card has room to "pop" upward without touching the text */}
      <div className="text-center max-w-xl mb-20">
        <h2 className="font-[Onest] font-bold text-[40px] tracking-tight text-[#101828]">
          {t("Our")} <span className="text-[#2E70FF]">{t("Services")}</span>
        </h2>
        <p className="mt-2 font-[Inter] text-[15px] text-[#475467]">
          {t("Our Services Desc")}
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-6 items-stretch max-w-[1200px] w-full">
        {services.map((item, idx) => (
          <div
            key={idx}
            style={item.dark ? {
              boxShadow: "10px -20px 100px -10px rgba(0, 208, 255, 0.05) inset",
            } : {
              boxShadow: "0px 4px 6px -2px rgba(16, 24, 40, 0.02)",
            }}
            className={`
              group relative w-full max-w-[330px] rounded-[24px] transition-all duration-[50ms] border
              p-5 flex flex-col will-change-transform transform-gpu

              ${item.dark
                ? "bg-[#111827] border-[#1F2937] text-white z-10 scale-105 hover:scale-110 hover:-translate-y-6 hover:shadow-2xl cursor-pointer shadow-2xl shadow-blue-900/20"
                : "bg-white border-[#E5E7EB] text-[#101828] hover:bg-[#111827] hover:text-white hover:border-[#1F2937] hover:scale-105 hover:-translate-y-4 hover:shadow-2xl hover:z-20 cursor-pointer"
              }
            `}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-[50ms] group-hover:rotate-3 ${item.dark ? "bg-[#7DD3FC20] border border-[#7DD3FC40]" : "bg-[#EFF6FF] border border-[#DBEAFE] group-hover:bg-[#7DD3FC20] group-hover:border-[#7DD3FC40]"}`}>
              <item.icon className={`w-6 h-6 transition-colors duration-[50ms] ${item.dark ? "text-[#7DD3FC]" : "text-[#2563EB] group-hover:text-[#7DD3FC]"}`} strokeWidth={2.5} />
            </div>

            {/* Title & Desc */}
            <h3 className="font-[Onest] font-black text-[24px] mb-2 tracking-tight transition-colors duration-[50ms] group-hover:text-blue-400">{item.title}</h3>
            <p className={`text-[13px] leading-relaxed mb-6 border-b pb-6 transition-all duration-[50ms] ${item.dark ? "text-gray-400 border-white/10" : "text-[#475467] border-gray-100 group-hover:text-gray-400 group-hover:border-white/10"}`}>
              {item.desc}
            </p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className={`text-[12px] font-bold transition-colors duration-[50ms] ${item.dark ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"}`}>$</span>
              <p className="font-[Onest] font-black text-[32px] tracking-tighter transition-colors duration-[50ms] group-hover:text-white">{item.price.replace(/.* /, '')}</p>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-8">
              {item.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-[12.5px] font-medium transition-transform duration-[50ms] group-hover:translate-x-1">
                  <div className={`min-w-[18px] h-[18px] rounded-full flex items-center justify-center mt-0.5 transition-all duration-[50ms] ${item.dark ? "bg-white" : "bg-[#EFF8FF] group-hover:bg-white"}`}>
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        className={`transition-all duration-[50ms] ${!item.dark ? "group-hover:stroke-[#111827]" : ""}`}
                        stroke={item.dark ? "#111827" : "#2563EB"}
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`transition-colors duration-[50ms] ${item.dark ? "text-gray-300" : "text-[#334155] group-hover:text-gray-300"}`}>{f}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <div className="mt-auto">
              <button
                onClick={() => handleSubscribe(item.id)}
                disabled={loading}
                className={`w-full py-3.5 rounded-2xl font-black text-[14px] transition-all duration-[50ms] transform active:scale-95 shadow-sm
                ${item.dark
                    ? "bg-[#2563EB] text-white hover:bg-blue-600 shadow-blue-900/20 disabled:opacity-50"
                    : "bg-white border-2 border-[#1570EF] text-[#1570EF] hover:bg-[#1570EF] hover:text-white group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] disabled:opacity-50"
                  }
              `}>
                {loading ? t("Initializing...") : t("Get Started")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}