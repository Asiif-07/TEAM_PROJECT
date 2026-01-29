import React from "react";
import sparkleIcon from "../../assets/aboutpic/Sparkle--Streamline-Phosphor.png";

const features = [
  { label: "AI-Powered",img:"/src/assets/aboutpic/Brain--Streamline-Core.png" },
  { label: "Human Verified", img:"/src/assets/aboutpic/Star-Badge--Streamline-Core.png" },
  { label: "Proven Result" ,img:"/src/assets/aboutpic/User-Check-Validate--Streamline-Core.png" },
];

const ProfileHero = () => {
  return (
    <section
      className="relative w-full bg-white pt-20 pb-16 overflow-hidden font-sans"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(67,145,255,0.22), transparent 55%), radial-gradient(circle at bottom right, rgba(67,145,255,0.22), transparent 55%), radial-gradient(circle at bottom left, rgba(67,145,255,0.18), transparent 55%)",
      }}
    >
      {/* Blue glow background similar to HowItWorksHero */}
      <div className="pointer-events-none absolute top-0 right-0 h-[550px] w-[550px] -translate-y-1/4 translate-x-1/3 rounded-full bg-[#4391FF]/30 blur-3xl mix-blend-multiply opacity-80" />

      <div className="relative mx-auto max-w-5xl px-4 text-center md:py-6 lg:py-8">
        {/* Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 shadow-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full ">
              <img
                src={sparkleIcon}
                alt="AI badge"
                className="h-4 w-4 object-contain"
              />
            </span>
            <span className="text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase">
              AI-Enhance Career Services
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          About{" "}
          <span className="bg-linear-to-r from-[#2563EB] to-[#38BDF8] bg-clip-text text-transparent">
            Curriculum.ai
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-slate-600 mb-10">
          We&apos;re revolutionizing career advancement by combining artificial
          intelligence with human expertise to create CVs that get you noticed
          and hired.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {features.map(({ label, img }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm"
            >
              <span className="flex h-7 w-7 overflow-hidden rounded-full bg-[#E0EDFF]">
                <img
                  src={img}
                  alt={label}
                  className="h-full w-full object-contain"
                />
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileHero;

