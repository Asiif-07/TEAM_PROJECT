import React from "react";
import { useTranslation } from "react-i18next";
// Image Imports based on your provided files
import sarahImg from "../../assets/aboutpic/Team Image.png"; //
import emilyImg from "../../assets/aboutpic/Image Wrapper.png"; //
import davidLImg from "../../assets/aboutpic/Team Image (1).png"; //
import ethanJImg from "../../assets/aboutpic/Image Wrapper (1).png"; //
import michaelImg from "../../assets/aboutpic/Image Wrapper (2).png"; //
import davidPImg from "../../assets/aboutpic/Team Image (2).png"; //
import noahImg from "../../assets/aboutpic/Image Wrapper (3).png"; //
import ethanCImg from "../../assets/aboutpic/Image Wrapper (4).png"; //

const OurTeam = () => {
  const { t } = useTranslation();
  const teamMembers = [
    { name: "Sarah Johnson", role: t("Roles.CEO"), avatar: sarahImg },
    { name: "Emily Kim", role: t("Roles.VP Product"), avatar: emilyImg },
    { name: "David Lee", role: t("Roles.CTO"), avatar: davidLImg },
    { name: "Ethan Johnson", role: t("Roles.VP Marketing"), avatar: ethanJImg },
    { name: "Michael Brown", role: t("Roles.VP Engineering"), avatar: michaelImg },
    { name: "David Patel", role: t("Roles.Head Design"), avatar: davidPImg },
    { name: "Noah Martinez", role: t("Roles.VP Sales"), avatar: noahImg },
    { name: "Ethan Chen", role: t("Roles.Head Success"), avatar: ethanCImg },
  ];
  return (
    <section className="w-full bg-white py-24 relative overflow-hidden">
      {/* Figma-specific Dot Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.25] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#CBD5E1 1.2px, transparent 1.2px)`, 
          backgroundSize: '28px 28px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-[42px] font-[900] tracking-tight text-slate-900 mb-4">
            {t("Meet our")} <span className="text-[#2563EB]">{t("team")}</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base font-medium leading-relaxed">
            {t("Team Subtext")}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col">
              {/* Image with exact Figma border radius */}
              <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-[#F8F9FA] mb-5 shadow-sm">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Text Layout: Left Aligned */}
              <div className="text-left">
                <h3 className="text-[18px] font-bold text-slate-900 mb-0.5">
                  {member.name}
                </h3>
                <p className="text-[14px] text-slate-500 font-medium">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;