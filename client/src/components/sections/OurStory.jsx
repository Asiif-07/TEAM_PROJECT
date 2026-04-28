import React from "react";
import containerImage from "../../assets/aboutpic/Container.png";
import { useTranslation } from "react-i18next";

const OurStory = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-gradient-to-b from-white to-[#E0F2FE]/40 py-16">
      <div className="max-w-[1315px] mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden">
          <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-10 p-6 md:p-10">
            {/* Left: Copy */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                {t("Our")} <span className="text-[#2563EB]">{t("Story")}</span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                {t("Our Story Desc 1")}
              </p>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6">
                {t("Our Story Desc 2")}
              </p>
              <button
                className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-[#5BB8FF] to-[#006CFF] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_14px_32px_rgba(0,108,255,0.55)] transition hover:brightness-110"
              >
                {t("Start Your Journey")}
              </button>
            </div>

            {/* Right: Image */}
            <div className="md:w-1/2 flex items-center justify-center">
              <div className="w-full max-w-[580px] rounded-2xl overflow-hidden bg-slate-900/90">
                <img
                  src={containerImage}
                  alt="AI brain visualization"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

