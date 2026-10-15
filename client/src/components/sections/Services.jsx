import React from "react";
import { FileText, Linkedin, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const getServices = (t) => [
  {
    id: "CV Writing",
    title: t("CV Writing"),
    price: 49,
    desc: t("CV Writing Desc"),
    features: [t("ATS-Optimized"), t("Industry-Specific"), t("24h Delivery"), t("Unlimited Revisions")],
    icon: FileText,
  },
  {
    id: "LinkedIn Optimization",
    title: t("LinkedIn Optimization"),
    price: 69,
    desc: t("CV Writing Desc"),
    features: [t("ATS-Optimized"), t("Industry-Specific"), t("24h Delivery"), t("Unlimited Revisions")],
    icon: Linkedin,
  },
  {
    id: "Cover Letter Service",
    title: t("Cover Letter Service"),
    price: 89,
    desc: t("CV Writing Desc"),
    features: [
      t("ATS-Optimized"), t("Industry-Specific"), t("24h Delivery"), t("Unlimited Revisions"),
      t("Professional Formatting"), t("Custom Templates"), t("Interview Coaching"), t("Keyword Optimization")
    ],
    icon: Mail,
  },
];


import { useState } from "react";
import toast from "react-hot-toast";
import { createCheckoutSession } from "../../api/stripe";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const { t } = useTranslation();
  const services = getServices(t);
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
  const [loadingId, setLoadingId] = useState(null);

  const handleSubscribe = async (planTitle) => {
    if (!isAuthenticated) {
      toast.error(t("Please login to subscribe"));
      navigate('/login', { state: { from: '/services' } });
      return;
    }
    try {
      setLoadingId(planTitle);
      const res = await createCheckoutSession({ planTitle, accessToken, refreshAccessToken });
      if (res && res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      toast.error(error.message || t("Failed to initiate payment"));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="w-full bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      {/* Heading */}
      <div className="mx-auto mb-12 max-w-xl text-center sm:mb-16">
        <h2 className="text-[32px] font-bold tracking-tight text-[#101828] sm:text-[40px]">
          {t("Our")} <span className="text-[#2E70FF]">{t("Services")}</span>
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#475467]">{t("Our Services Desc")}</p>
      </div>

      {/* Cards */}
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((item) => {
          const Icon = item.icon;
          const isLoading = loadingId === item.id;
          return (
            <article
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#BFDBFE] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.18)] focus-within:-translate-y-1.5 focus-within:border-[#BFDBFE] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
            >
              {/* Accent bar */}
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#60A5FA] to-[#2563EB] transition-transform duration-300 group-hover:scale-x-100 group-focus-within:scale-x-100" />

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] text-[#2563EB] transition-colors duration-300 group-hover:border-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white">
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>

              <h3 className="text-[22px] font-extrabold tracking-tight text-[#101828]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#475467]">{item.desc}</p>

              <div className="my-6 flex items-baseline gap-1.5 border-y border-[#F2F4F7] py-5">
                <span className="text-[12px] font-semibold text-[#98A2B3]">{t("From Price")}</span>
                <span className="text-[36px] font-extrabold leading-none tracking-tight text-[#101828]">{item.price}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {item.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] text-[#344054]">
                    <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#EFF8FF]">
                      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => handleSubscribe(item.id)}
                  disabled={loadingId !== null}
                  aria-busy={isLoading}
                  className="w-full rounded-xl border border-[#2563EB] bg-white py-3 text-[14px] font-bold text-[#2563EB] transition-all duration-300 hover:bg-[#2563EB] hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:text-[#2563EB]"
                >
                  {isLoading ? t("Initializing...") : t("Get Started")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
