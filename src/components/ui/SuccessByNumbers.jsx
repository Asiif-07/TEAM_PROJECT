import React from "react";
import frame1 from "../../assets/aboutpic/Frame 72 (1).png";
import frame2 from "../../assets/aboutpic/Frame 72 (2).png";
import frame3 from "../../assets/aboutpic/Frame 72 (3).png";
import frame4 from "../../assets/aboutpic/Frame 75.png";

const stats = [
  {
    label: "CVs Created",
    value: "10,000+",
    subLabel: "CVs Created",
    bg: "bg-[#F9EEA5]",
    icon: frame1,
  },
  {
    label: "Success Rate",
    value: "94%",
    subLabel: "Success Rate",
    bg: "bg-[#E1DEFA]",
    icon: frame2,
  },
  {
    label: "Delivery Time",
    value: "24–48h",
    subLabel: "Delivery Time",
    bg: "bg-[#CAEDB8]",
    icon: frame3,
  },
  {
    label: "Customer Rating",
    value: "4.9",
    subLabel: "Customer Rating",
    bg: "bg-[#C9FF85]",
    icon: frame4,
  },
];

const SuccessByNumbers = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-[#E0F2FE]/60">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Our <span className="text-[#2563EB]">success</span> by the{" "}
            <span className="text-[#2563EB]">numbers</span>
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-500">
            Measurable impact, proven results — a quick look at what sets us
            apart.
          </p>
        </div>

        {/* Cards */}
        <div className="bg-white rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-slate-100 px-4 py-4 md:px-4 md:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((item) => (
              <div
                key={item.subLabel}
                className={`${item.bg} w-[268px] h-[245px] rounded-[12px] p-5 flex flex-col justify-between opacity-100 shadow-sm border border-black/5`}
              >
                {/* Top frame image spanning card width */}
                <div className="w-full mb-8">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="mt-auto">
                  <div className="text-2xl md:text-3xl font-semibold text-slate-900 mb-1">
                  {item.value}
                  </div>
                  <div className="text-xs md:text-sm text-slate-700">
                    {item.subLabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessByNumbers;

