import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
  FilePlus2,
  FileText,
  LayoutTemplate,
  Newspaper,
  PenSquare,
  Sparkles,
  UploadCloud,
  UserCircle,
  UserPen,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as cvApi from "../../api/cv";
import useBlogStore from "../../store/useBlogStore";

// Every entry points at a route or feature that already exists in router.jsx.
const FEATURES = [
  {
    id: "create-cv",
    icon: FilePlus2,
    title: "Create a CV",
    desc: "Pick a template and build a new CV with a live preview.",
    cta: "Start building",
    to: "/cv-templates",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    id: "my-cvs",
    icon: FileText,
    title: "Update your CVs",
    desc: "Open, edit, download or delete the CVs you have already saved.",
    cta: "Open my CVs",
    to: "/my-cvs",
    accent: "from-violet-500 to-purple-600",
  },
  {
    id: "templates",
    icon: LayoutTemplate,
    title: "Browse templates",
    desc: "Explore professionally designed layouts and choose one to start from.",
    cta: "View templates",
    to: "/cv-templates",
    accent: "from-sky-500 to-cyan-600",
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "AI writing tools",
    desc: "Generate summaries, experience bullets, project descriptions and skills inside the CV builder.",
    cta: "Open the builder",
    to: "/cv-builder",
    accent: "from-fuchsia-500 to-pink-600",
  },
  {
    id: "import",
    icon: UploadCloud,
    title: "Import a resume",
    desc: "Upload a PDF or DOCX and let AI extract the details into the builder.",
    cta: "Import now",
    to: "/cv-builder",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: "profile",
    icon: UserCircle,
    title: "Account & profile",
    desc: "Update your photo, email and password, and manage your subscription.",
    cta: "Manage account",
    to: "/profile",
    accent: "from-slate-600 to-slate-800",
  },
  {
    id: "write",
    icon: PenSquare,
    title: "Write an article",
    desc: "Publish a career article with images and categories.",
    cta: "New article",
    to: "/blogs/create",
    accent: "from-orange-500 to-red-500",
  },
  {
    id: "my-blogs",
    icon: Newspaper,
    title: "My articles",
    desc: "Edit or remove the articles you have published.",
    cta: "Manage articles",
    to: "/my-blogs",
    accent: "from-amber-500 to-orange-600",
  },
  {
    id: "blog-profile",
    icon: UserPen,
    title: "Blog profile",
    desc: "Set your author bio, avatar and social links shown on your articles.",
    cta: "Edit blog profile",
    to: "/blog-profile",
    accent: "from-rose-500 to-pink-600",
  },
  {
    id: "blog",
    icon: BookOpen,
    title: "Read the blog",
    desc: "Browse career advice, interview tips and industry insights.",
    cta: "Explore articles",
    to: "/blogs",
    accent: "from-lime-500 to-green-600",
  },
  {
    id: "services",
    icon: Briefcase,
    title: "Career services",
    desc: "CV writing, LinkedIn optimization and cover letter services.",
    cta: "See services",
    to: "/services",
    accent: "from-indigo-500 to-blue-700",
  },
];

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />;
}

function StatCard({ icon, label, value, loading, to }) {
  const Icon = icon;
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={22} />
      </span>
      <span className="flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        {loading ? (
          <Skeleton className="mt-1 h-7 w-12" />
        ) : (
          <span className="block text-2xl font-bold text-slate-900">{value}</span>
        )}
      </span>
      <ArrowRight size={18} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
    </Link>
  );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, accessToken, refreshAccessToken, isAuthenticated } = useAuth();

  const [cvs, setCvs] = useState([]);
  const [cvsLoading, setCvsLoading] = useState(true);
  const [cvsError, setCvsError] = useState("");

  const myPosts = useBlogStore((s) => s.myPosts);
  const postsLoading = useBlogStore((s) => s.loading);
  const fetchMyPosts = useBlogStore((s) => s.fetchMyPosts);

  // Carousel
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return undefined;
    let cancelled = false;
    (async () => {
      try {
        setCvsLoading(true);
        setCvsError("");
        const res = await cvApi.getMyCvs({ accessToken, refreshAccessToken });
        if (!cancelled) setCvs(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        if (!cancelled) setCvsError(e?.message || t("Failed CVs"));
      } finally {
        if (!cancelled) setCvsLoading(false);
      }
    })();
    fetchMyPosts({ accessToken, refreshAccessToken });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, accessToken, refreshAccessToken, fetchMyPosts, t]);

  const syncCarousel = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth;
    setActive(Math.round(el.scrollLeft / step));
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    syncCarousel();
    window.addEventListener("resize", syncCarousel);
    return () => window.removeEventListener("resize", syncCarousel);
  }, [syncCarousel]);

  // Smooth-scroll to a target offset; if the browser ignores smooth scrolling
  // (e.g. embedded webviews), jump there so the controls never appear dead.
  const scrollToOffset = (left) => {
    const el = trackRef.current;
    if (!el) return;
    const start = el.scrollLeft;
    el.scrollTo({ left, behavior: "smooth" });
    window.setTimeout(() => {
      if (el.scrollLeft === start && Math.abs(left - start) > 4) el.scrollTo({ left, behavior: "auto" });
    }, 400);
  };

  const cardStep = () => {
    const el = trackRef.current;
    const card = el?.firstElementChild;
    return card ? card.getBoundingClientRect().width + 16 : el?.clientWidth || 0;
  };

  const scrollByCards = (dir) => {
    const el = trackRef.current;
    if (el) scrollToOffset(el.scrollLeft + dir * cardStep());
  };

  const goTo = (index) => scrollToOffset(index * cardStep());

  const openCv = (cv) => {
    const params = new URLSearchParams({
      cvId: cv._id,
      template: cv.templateId || "modern-blue",
      category: cv.templateCategory || "saved",
    });
    navigate(`/cv-builder?${params.toString()}`);
  };

  const firstName = user?.name?.split(" ")[0] || t("there", "there");
  const isPremium = user?.subscriptionStatus === "active";
  const recentCvs = cvs.slice(0, 3);

  return (
    <div className="min-h-screen bg-mesh pb-24 pt-8">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="animate-fade-in-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 p-6 text-white shadow-xl sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {user?.profileImage?.secure_url ? (
                <img
                  src={user.profileImage.secure_url}
                  alt=""
                  className="h-16 w-16 rounded-2xl border-2 border-white/30 object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-medium text-blue-100">{t("Welcome back", "Welcome back")}</p>
                <h1 className="text-2xl font-bold sm:text-3xl">{firstName}</h1>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    isPremium ? "bg-amber-400/20 text-amber-200" : "bg-white/10 text-blue-100"
                  }`}
                >
                  {isPremium && <Crown size={12} />}
                  {isPremium ? t("Premium Member") : t("Free Plan")}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cv-templates"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FilePlus2 size={18} />
                {t("Create a CV", "Create a CV")}
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <UserCircle size={18} />
                {t("Profile", "Profile")}
              </Link>
              <Link
                to="/my-cvs"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t("My CVs", "My CVs")}
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section aria-label="Overview" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FileText} label={t("Saved CVs", "Saved CVs")} value={cvs.length} loading={cvsLoading} to="/my-cvs" />
          <StatCard
            icon={Newspaper}
            label={t("My Articles", "My Articles")}
            value={myPosts.length}
            loading={postsLoading}
            to="/my-blogs"
          />
          <StatCard
            icon={Award}
            label={t("Plan", "Plan")}
            value={isPremium ? t("Premium") : t("Free")}
            loading={false}
            to="/profile"
          />
        </section>

        {/* Feature carousel */}
        <section aria-label="Features">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t("Everything you can do", "Everything you can do")}</h2>
              <p className="text-sm text-slate-500">{t("Jump straight into any feature", "Jump straight into any feature")}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!canPrev}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!canNext}
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            onScroll={syncCarousel}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.id}
                  to={f.to}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="animate-fade-in-up group relative flex min-h-[230px] w-[78%] shrink-0 snap-start flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:w-[300px]"
                >
                  <span className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-md`}>
                    <Icon size={22} />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{t(f.title, f.title)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{t(f.desc, f.desc)}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                    {t(f.cta, f.cta)}
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
            {FEATURES.map((f, i) => (
              <button
                key={f.id}
                type="button"
                tabIndex={-1}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-blue-600" : "w-1.5 bg-slate-300"}`}
              />
            ))}
          </div>
        </section>

        {/* Recent CVs */}
        <section aria-label="Recent CVs">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t("Recent CVs", "Recent CVs")}</h2>
            {cvs.length > 0 && (
              <Link to="/my-cvs" className="text-sm font-semibold text-blue-600 hover:underline">
                {t("View all", "View all")}
              </Link>
            )}
          </div>

          {cvsLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
          ) : cvsError ? (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {cvsError}
            </div>
          ) : recentCvs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText size={26} />
              </span>
              <h3 className="text-lg font-bold text-slate-900">{t("No CVs yet", "No CVs yet")}</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                {t("Create your first CV from a template or import an existing resume.", "Create your first CV from a template or import an existing resume.")}
              </p>
              <Link
                to="/cv-templates"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <FilePlus2 size={18} />
                {t("Create a CV", "Create a CV")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {recentCvs.map((cv) => (
                <button
                  key={cv._id}
                  type="button"
                  onClick={() => openCv(cv)}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FileText size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-slate-900">{cv.name || t("Untitled CV")}</span>
                    <span className="block truncate text-xs text-slate-500">
                      {t("Template")}: {cv.templateId || "modern-blue"}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-blue-600">{t("Edit", "Edit")}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
