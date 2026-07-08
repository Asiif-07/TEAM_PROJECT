import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronRight, Clock, User as UserIcon, PenTool, Heart } from 'lucide-react';
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

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");

    const activeCategory = searchParams.get('category') || "All";

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
        setSearchParams(newParams);
    };

    const handleCategoryClick = (category) => {
        const newParams = new URLSearchParams(searchParams);
        if (category === "All") newParams.delete('category');
        else newParams.set('category', category);
        setSearchParams(newParams);
    };

    const displayPosts = posts || [];

    return (
        <div className="min-h-screen bg-mesh pb-32 pt-10 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/5 rounded-2xl border border-blue-600/10 mb-4">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Industry Insights</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
                            The <span className="premium-text-gradient">Editorial</span> <br /> Career Archive
                        </h1>
                        <p className="text-gray-500 text-xl font-medium max-w-xl leading-relaxed">
                            A curated collection of professional wisdom, design strategies, and career blueprints.
                        </p>
                    </div>
                    <div className="pt-6">
                        <button
                            onClick={() => navigate('/blogs/create')}
                            className="group flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-gray-400/30 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                            <PenTool size={20} className="group-hover:rotate-12 transition-transform" />
                            Contribute Article
                        </button>
                    </div>
                </div>

                {/* Filters & Search - Premium Bar */}
                <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-2xl border border-white/20 p-4 rounded-[32px] shadow-2xl shadow-gray-200/50 mb-16 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto px-2">
                        <button
                            onClick={() => handleCategoryClick("All")}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeCategory === "All"
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                                : "bg-white text-gray-400 border border-gray-50 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeCategory === cat.name
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105"
                                    : "bg-white text-gray-400 border border-gray-50 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96 group px-2 md:px-0">
                        <input
                            type="text"
                            placeholder="Discover articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-bold placeholder:text-gray-400"
                        />
                        <Search className="absolute left-6 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    </form>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {loading ? (
                        [...Array(6)].map((_, i) => <BlogSkeleton key={i} />)
                    ) : (displayPosts.length > 0 || (activeCategory !== "All" && posts?.length > 0)) ? (
                        (activeCategory === "All" ? displayPosts : posts).map((post) => (
                            <div
                                key={post._id}
                                onClick={() => navigate(`/blogs/${post.slug}`)}
                                className="group bg-white rounded-[40px] overflow-hidden border border-transparent hover:border-blue-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 cursor-pointer flex flex-col h-full"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    {post.coverImage?.secure_url && (
                                        <img
                                            src={post.coverImage.secure_url}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    )}
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-10 flex-grow flex flex-col space-y-6">
                                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400/60 uppercase tracking-[0.2em]">
                                        <span>{formatDate(post.createdAt)}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600/10"></span>
                                        <span>{calculateReadingTime(post.content)}</span>
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-500 line-clamp-3 text-base leading-relaxed font-medium">
                                        {stripHtml(post.content).substring(0, 140)}...
                                    </p>

                                    <div className="pt-8 mt-auto flex items-center justify-between border-t border-gray-50">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600/60 uppercase tracking-widest">
                                                <Heart size={14} className="fill-current" />
                                                {post.likeCount || 0}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400/60 uppercase tracking-widest">
                                                <Clock size={14} />
                                                {post.views || 0}
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-40 text-center bg-white/50 backdrop-blur-sm rounded-[60px] border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-200">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">No articles found.</h3>
                            <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => setSearchParams({})}
                                className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                            >
                                Reset Archive
                            </button>
                        </div>
                    )}
                </div>

                {/* Newsletter Section - Premium Glassmorphism */}
                <div className="mt-40 relative group">
                    <div className="absolute -inset-10 bg-blue-600/5 rounded-[80px] blur-3xl group-hover:bg-blue-600/10 transition-all duration-1000"></div>
                    <div className="relative bg-white border border-white/20 p-12 lg:p-24 rounded-[60px] shadow-2xl overflow-hidden text-center space-y-12 backdrop-blur-3xl">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight">
                                Stay ahead of the <br /> <span className="premium-text-gradient">Career Curve</span>
                            </h2>
                            <p className="text-gray-500 text-xl font-medium leading-relaxed">
                                Join 5,000+ professionals receiving weekly insights, industry templates, and design inspiration directly in their inbox.
                            </p>
                        </div>
                        <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-grow px-8 py-5 rounded-[24px] bg-gray-50 border border-transparent focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all text-sm font-bold shadow-inner"
                            />
                            <button className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest text-sm hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-1 transition-all active:translate-y-0">
                                Subscribe
                            </button>
                        </form>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            No spam. Just professional growth. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogFeed;
