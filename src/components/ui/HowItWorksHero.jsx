import React from "react";

const HowItWorksHero = () => {
  return (
    <section
      className="relative w-full bg-white pt-20 pb-16 overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(67,145,255,0.22), transparent 55%), radial-gradient(circle at bottom right, rgba(67,145,255,0.22), transparent 55%), radial-gradient(circle at bottom left, rgba(67,145,255,0.18), transparent 55%)",
      }}
    >
      {/* Blue glow background using #4391FF */}
      <div className="pointer-events-none absolute top-0 right-0 h-[550px] w-[550px] -translate-y-1/4 translate-x-1/3 rounded-full bg-[#4391FF]/30 blur-3xl mix-blend-multiply opacity-80" />

      <div className="relative mx-auto max-w-5xl px-4 text-center md:py-6 lg:py-8">
        {/* Main heading */}
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[52px]">
          How Our{" "}
          <span className="bg-linear-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            AI Magic
          </span>{" "}
          Work
        </h1>

        {/* Sub heading text */}
        <p className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-slate-600 md:text-base">
          Discover the revolutionary process that combines cutting-edge
          artificial intelligence with expert human insight to transform your
          career documents into powerful tools for success.
        </p>

        {/* Rating + buttons card */}
        <div className="mx-auto mt-10 max-w-lg rounded-[28px]  px-10 py-7 text-center ">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Trusted by Professionals
          </p>

          {/* Avatars + rating on the same line, text under rating */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-700">
                  A
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-200 text-[11px] font-semibold text-indigo-700">
                  B
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-200 text-[11px] font-semibold text-pink-700">
                  C
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200 text-[11px] font-semibold text-emerald-700">
                  D
                </span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 text-[11px] font-semibold text-amber-700">
                  +4
                </span>
              </div>

              <div className="flex flex-col items-start gap-1 text-sm font-semibold text-slate-900">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>4.8</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                  Trusted by 1.4m+ users
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {/* Primary gradient button */}
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5BB8FF] to-[#006CFF] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-[0_14px_32px_rgba(0,108,255,0.55)] transition hover:brightness-110"
            >
              Get Start Now
              <span className="text-xs">→</span>
            </button>

            {/* Outline button */}
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-700 shadow-sm transition hover:bg-slate-50">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-slate-50 text-[10px] text-slate-700">
                ▶
              </span>
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHero;

