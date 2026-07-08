// CV Builder Theme — Matching the glassmorphism, blue-primary, rounded design
export const S = {
  // Layout
  page: "min-h-screen py-8 lg:py-16 bg-[#f8f9fa]",
  topBar: "max-w-7xl mx-auto mb-6 lg:mb-10 px-4 sm:px-6 flex items-center justify-between",
  canvas: "max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-start",
  editorCol: "flex-[0_1_800px] w-full space-y-4",
  sidebarCol: "w-full lg:w-[380px] space-y-4 shrink-0",

  // Main glass card (matches Paper in CVBuilder)
  glassCard: "glass rounded-3xl lg:rounded-[32px] p-4 sm:p-6 lg:p-10 bg-white",

  // Sidebar card (purple-left accent kept, but using CV builder rounding)
  card: "bg-white/50 backdrop-blur-sm rounded-2xl border border-black/5 p-5 transition-all hover:bg-white/80",
  cardTitle: "text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2",

  // Inputs (matches PremiumInput)
  input: "w-full bg-white/50 border border-black/5 rounded-2xl px-4 py-3 text-sm text-gray-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400",
  titleInput: "w-full text-3xl lg:text-[2.5rem] leading-[1.2] font-extrabold text-gray-300 placeholder:text-gray-300 border-none focus:ring-0 p-0 resize-none bg-transparent focus:outline-none",
  titleFilled: "w-full text-3xl lg:text-[2.5rem] leading-[1.2] font-extrabold text-gray-900 border-none focus:ring-0 p-0 resize-none bg-transparent focus:outline-none",

  // Buttons (matches CVBuilder contained buttons)
  btnPublish: "px-6 py-3 bg-[#2563EB] text-white rounded-2xl text-sm font-bold hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.97]",
  btnDraft: "px-5 py-3 bg-white text-gray-600 border border-black/5 rounded-2xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all",

  // Tags
  tag: "inline-flex items-center gap-1.5 bg-blue-50 text-[#2563EB] px-3 py-1.5 rounded-xl text-[11px] font-bold border border-blue-100",

  // Dropzone
  coverZone: "border-2 border-dashed border-gray-200 rounded-3xl py-16 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#2563EB] hover:bg-blue-50/30 transition-all duration-300",
  galleryZone: "border-2 border-dashed border-gray-200 rounded-2xl py-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#2563EB] hover:bg-blue-50/20 transition-all duration-200",
};
