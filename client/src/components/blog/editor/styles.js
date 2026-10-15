// Blog editor theme — aligned with the dashboard design system (slate neutrals, blue primary, rounded-2xl cards)
export const S = {
  // Layout
  page: "bg-mesh min-h-screen pt-8 pb-32 lg:pt-10",
  topBar: "max-w-7xl mx-auto mb-6 lg:mb-8 px-4 sm:px-6 lg:px-8",
  canvas: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6 items-start",
  editorCol: "flex-1 min-w-0 w-full space-y-6",
  sidebarCol: "w-full lg:w-[340px] space-y-5 shrink-0 lg:sticky lg:top-24",

  // Cards
  glassCard: "rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm",
  card: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
  cardTitle: "mb-1 flex items-center gap-2 text-sm font-bold text-slate-900",
  cardHint: "mb-3 text-xs text-slate-500",
  label: "mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-800",

  // Inputs
  input: "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
  titleInput: "w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-slate-900 placeholder:text-slate-300 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
  titleFilled: "w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-slate-900 placeholder:text-slate-300 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
  error: "mt-1.5 text-xs font-medium text-red-600",

  // Buttons
  btnPublish: "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
  btnDraft: "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60",

  // Tags
  tag: "inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700",

  // Dropzones
  coverZone: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
  galleryZone: "flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-4 text-center transition hover:border-blue-400 hover:bg-blue-50/40",
};
