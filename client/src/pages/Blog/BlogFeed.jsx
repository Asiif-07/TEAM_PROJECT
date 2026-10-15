import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, ArrowRight, Clock, Heart, Eye, PenTool, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useBlogStore from '../../store/useBlogStore';
import BlogSkeleton from '../../components/blog/BlogSkeleton';
import { formatDate, calculateReadingTime, stripHtml } from '../../utils/blogUtils';

// Categories are fetched from the API and managed in the store

const BlogFeed = () => {
    // Selectors: only subscribe to what we need
    const posts = useBlogStore((state) => state.posts);
    const loading = useBlogStore((state) => state.loading);
    const categories = useBlogStore((state) => state.categories);
    const fetchPosts = useBlogStore((state) => state.fetchPosts);
    const fetchCategories = useBlogStore((state) => state.fetchCategories);
    const totalPages = useBlogStore((state) => state.totalPages);
    const currentPage = useBlogStore((state) => state.currentPage);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const activeCategory = searchParams.get('category') || 'All';

    // Category scroller (arrows appear only when there is more to scroll to)
    const catRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const syncArrows = useCallback(() => {
        const el = catRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    const scrollCategories = (dir) => {
        const el = catRef.current;
        if (!el) return;
        const start = el.scrollLeft;
        const target = start + dir * Math.max(160, el.clientWidth * 0.7);
        el.scrollTo({ left: target, behavior: 'smooth' });
        // Some embedded browsers ignore smooth scrolling; make sure the control never looks dead.
        window.setTimeout(() => {
            if (el.scrollLeft === start) el.scrollTo({ left: target, behavior: 'instant' });
            syncArrows();
        }, 400);
        // Re-check once the smooth scroll has settled so the arrows never show a stale state.
        window.setTimeout(syncArrows, 800);
    };

    useEffect(() => {
        syncArrows();
        window.addEventListener('resize', syncArrows);
        return () => window.removeEventListener('resize', syncArrows);
    }, [syncArrows, categories]);

    // Keep the selected category visible inside the scroller
    useEffect(() => {
        const el = catRef.current;
        const active = el?.querySelector('[aria-pressed="true"]');
        if (!el || !active) return;
        const left = active.offsetLeft - el.offsetLeft;
        if (left < el.scrollLeft || left + active.offsetWidth > el.scrollLeft + el.clientWidth) {
            el.scrollTo({ left: Math.max(0, left - 24), behavior: 'instant' });
        }
        syncArrows();
    }, [activeCategory, categories, syncArrows]);
    const authorFilter = searchParams.get('author');

    useEffect(() => {
        const query = searchParams.toString();
        fetchPosts(query);
        fetchCategories();
    }, [searchParams, fetchPosts, fetchCategories]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (searchTerm) newParams.set('search', searchTerm);
        else newParams.delete('search');
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const handleCategoryClick = (category) => {
        const newParams = new URLSearchParams(searchParams);
        if (category === 'All') newParams.delete('category');
        else newParams.set('category', category);
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const goToPage = (page) => {
        const newParams = new URLSearchParams(searchParams);
        if (page <= 1) newParams.delete('page');
        else newParams.set('page', String(page));
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearAuthorFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('author');
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const displayPosts = posts || [];

    const chip = (active) =>
        `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700'
        }`;

    return (
        <div className="bg-mesh min-h-screen pb-24 pt-10 animate-fade-in">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <span className="mb-3 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                            Career Blog
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Insights for your <span className="premium-text-gradient">career</span>
                        </h1>
                        <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">
                            Practical advice on CVs, interviews, job search and growth from our community.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/blogs/create')}
                        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                    >
                        <PenTool size={16} className="transition-transform group-hover:rotate-12" />
                        Write an article
                    </button>
                </div>

                {/* Filters & search */}
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => scrollCategories(-1)}
                            disabled={!canScrollLeft}
                            aria-label="Scroll categories left"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-default disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div
                            ref={catRef}
                            onScroll={syncArrows}
                            role="group"
                            aria-label="Categories"
                            className="flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            <button
                                type="button"
                                aria-pressed={activeCategory === 'All'}
                                onClick={() => handleCategoryClick('All')}
                                className={chip(activeCategory === 'All')}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    type="button"
                                    key={cat._id}
                                    aria-pressed={activeCategory === cat.name}
                                    onClick={() => handleCategoryClick(cat.name)}
                                    className={chip(activeCategory === cat.name)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => scrollCategories(1)}
                            disabled={!canScrollRight}
                            aria-label="Scroll categories right"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-default disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSearch} role="search" className="relative w-full shrink-0 lg:w-72">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            aria-label="Search articles"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        />
                    </form>
                </div>

                {authorFilter && (
                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
                        <span>Showing articles by one author.</span>
                        <button
                            type="button"
                            onClick={clearAuthorFilter}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                        >
                            <X size={14} /> Clear
                        </button>
                    </div>
                )}

                {/* Posts */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        [...Array(6)].map((_, i) => <BlogSkeleton key={i} />)
                    ) : displayPosts.length > 0 ? (
                        displayPosts.map((post) => {
                            const authorName = post.author?.blogProfile?.displayName || post.author?.name;
                            const avatar = post.author?.blogProfile?.avatar?.secure_url || post.author?.profileImage?.secure_url;
                            return (
                                <Link
                                    key={post._id}
                                    to={`/blogs/${post.slug}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                        {post.coverImage?.secure_url && (
                                            <img
                                                src={post.coverImage.secure_url}
                                                alt={post.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                        {post.category && (
                                            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
                                                {post.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                                        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                            <span>{formatDate(post.createdAt)}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <span className="inline-flex items-center gap-1">
                                                <Clock size={12} />
                                                {calculateReadingTime(post.content)}
                                            </span>
                                        </div>

                                        <h3 className="line-clamp-2 [overflow-wrap:anywhere] text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                                            {post.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-3 [overflow-wrap:anywhere] text-sm leading-relaxed text-slate-500">
                                            {stripHtml(post.content).substring(0, 160)}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                {avatar ? (
                                                    <img src={avatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                                                ) : (
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                        {authorName?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                )}
                                                <span className="truncate text-sm font-medium text-slate-700">{authorName || 'CareerForge'}</span>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <Heart size={13} /> {post.likeCount || 0}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Eye size={13} /> {post.views || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                                            View blog
                                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center">
                            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <Search size={26} />
                            </span>
                            <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
                            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSearchParams({});
                                }}
                                className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Reset filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <span className="text-sm font-medium text-slate-500">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </nav>
                )}

                {/* Newsletter */}
                <div className="mt-16 rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-14">
                    <div className="mx-auto max-w-xl space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            Stay ahead of the <span className="premium-text-gradient">career curve</span>
                        </h2>
                        <p className="text-base text-slate-500">Get new articles delivered to your inbox.</p>
                    </div>
                    <form
                        className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // No newsletter endpoint exists on the server yet.
                            toast('Newsletter sign-up is not available yet.');
                        }}
                    >
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            aria-label="Email address"
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogFeed;
