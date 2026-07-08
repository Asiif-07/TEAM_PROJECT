import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, MessageCircle, Share2, ArrowLeft, Clock, Calendar } from 'lucide-react';
import useBlogStore from '../../store/useBlogStore';
import AuthorInfo from '../../components/blog/AuthorInfo';
import BlogCarousel from '../../components/blog/BlogCarousel';
import CommentSection from '../../components/blog/CommentSection';
import { formatDate, calculateReadingTime } from '../../utils/blogUtils';
import toast from 'react-hot-toast';

const PostDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-white pb-32 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {/* Back button skeleton */}
                <div className="h-4 w-32 bg-gray-100 rounded-md mb-16"></div>

                <div className="flex flex-col lg:flex-row gap-16 relative justify-center">
                    {/* Main Article Container */}
                    <div className="flex-grow max-w-3xl space-y-10">
                        <header className="space-y-6 text-center lg:text-left">
                            {/* Category Badge */}
                            <div className="flex justify-center lg:justify-start">
                                <div className="h-8 w-24 bg-gray-100 rounded-2xl"></div>
                            </div>

                            {/* Title lines */}
                            <div className="space-y-3">
                                <div className="h-10 w-full bg-gray-100 rounded-xl"></div>
                                <div className="h-10 w-4/5 bg-gray-100 rounded-xl mx-auto lg:mx-0"></div>
                            </div>

                            {/* Meta items */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                                <div className="h-8 w-28 bg-gray-100 rounded-xl"></div>
                                <div className="h-8 w-32 bg-gray-100 rounded-xl"></div>
                                <div className="h-8 w-24 bg-gray-100 rounded-xl"></div>
                            </div>
                        </header>

                        {/* Image Carousel/Cover */}
                        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-[48px]"></div>

                        {/* Article Content prose block */}
                        <div className="space-y-6 pt-8">
                            <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                            <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                            <div className="h-4 w-5/6 bg-gray-100 rounded-md"></div>
                            <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                            <div className="h-4 w-3/4 bg-gray-100 rounded-md"></div>
                        </div>
                    </div>

                    {/* Right Rail */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-1 h-20 bg-gray-100 rounded-[24px]"></div>
                                <div className="flex-1 h-20 bg-gray-100 rounded-[24px]"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                                    <div className="h-4 w-5/6 bg-gray-100 rounded-md"></div>
                                    <div className="h-4 w-4/5 bg-gray-100 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const PostDetail = () => {
    const { slug } = useParams();
    const { activePost, fetchPostBySlug, likePost, loading } = useBlogStore();
    const { user, accessToken, refreshAccessToken } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    const liked = user && activePost?.likes?.includes(user._id);

    useEffect(() => {
        fetchPostBySlug(slug);
    }, [slug, fetchPostBySlug]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / scrollHeight) * 100;
            const progressBar = document.getElementById('reading-progress');
            if (progressBar) progressBar.style.width = `${progress}%`;

            setScrolled(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activePost]);

    if (loading || !activePost) {
        return <PostDetailSkeleton />;
    }

    const handleLike = () => {
        if (!user) {
            toast.error("Protocol Error: Identity Required for Appreciation");
            return;
        }
        likePost(activePost._id, { accessToken, refreshAccessToken });
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: activePost.title, url }).catch(() => {
                navigator.clipboard.writeText(url);
                toast.success("Link copied!");
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied!");
        }
    };

    const headers = [];
    const contentWithIds = activePost.content.replace(/<(h[23])>(.*?)<\/h[23]>/g, (match, tag, text) => {
        // Strip tags and decode entities for the TOC display text
        const rawText = text.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
        const id = rawText.toLowerCase().replace(/[^\w]/g, '-');
        headers.push({ id, text: rawText, level: tag });
        return `<${tag} id="${id}" class="scroll-mt-32">${text}</${tag}>`;
    });

    const carouselImages = activePost.bodyImages?.length > 0
        ? [activePost.coverImage, ...activePost.bodyImages]
        : [activePost.coverImage];

    return (
        <div className="min-h-screen bg-white pb-32 animate-fade-in relative">
            {/* Reading Progress */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-50 z-[100]">
                <div id="reading-progress" className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
            </div>

            {/* Sticky Mobile/Desktop Action Header */}
            <div className={`fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-500 ${scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 truncate mr-8">
                        <span className="hidden sm:inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">{activePost.category}</span>
                        <h2 className="text-sm font-black text-gray-900 truncate max-w-sm">{activePost.title}</h2>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button onClick={handleLike} className={`p-3 rounded-xl border transition-all ${liked ? 'bg-red-50 border-red-100 text-red-500' : 'hover:bg-gray-50 border-gray-100 text-gray-400'}`}>
                            <Heart size={18} fill={liked ? "currentColor" : "none"} />
                        </button>
                        <button onClick={handleShare} className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <Link to="/blogs" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all mb-16 font-black uppercase tracking-[0.2em] text-[10px] group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Archive
                </Link>

                <div className="flex flex-col lg:flex-row gap-16 relative justify-center">
                    {/* Center: Article */}
                    <article className="flex-grow max-w-3xl">
                        <header className="space-y-10 mb-20 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <span className="px-5 py-2 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100">
                                    {activePost.category || "Editorial"}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tighter">
                                {activePost.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-2.5 text-blue-600 bg-blue-50/50 px-4 py-2 rounded-xl">
                                    <Clock size={16} />
                                    {calculateReadingTime(activePost.content)}
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Calendar size={16} />
                                    {formatDate(activePost.createdAt)}
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <MessageCircle size={16} />
                                    Thought Leadership
                                </div>
                            </div>
                        </header>

                        <div className="relative group mb-24 rounded-[48px] overflow-hidden shadow-2xl scale-100 hover:scale-[1.02] transition-transform duration-700">
                            <BlogCarousel images={carouselImages} />
                        </div>

                        <div
                            className="premium-prose max-w-none text-gray-700 leading-[1.9] font-medium text-xl break-words
                                prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tighter prose-headings:mt-16 prose-headings:mb-8
                                prose-h2:text-4xl prose-h3:text-2xl
                                prose-p:mb-10 prose-p:opacity-90
                                prose-strong:text-gray-900 prose-strong:font-black
                                prose-blockquote:border-l-0 prose-blockquote:bg-gray-50/80 prose-blockquote:py-16 prose-blockquote:px-12 prose-blockquote:rounded-[40px] prose-blockquote:my-16 prose-blockquote:relative
                                prose-blockquote:before:content-['\201C'] prose-blockquote:before:absolute prose-blockquote:before:-top-4 prose-blockquote:before:left-10 prose-blockquote:before:text-8xl prose-blockquote:before:text-blue-200 prose-blockquote:before:font-serif
                                prose-img:rounded-[40px] prose-img:shadow-2xl prose-img:my-16
                                prose-li:mb-4 prose-ol:list-decimal prose-ul:list-disc prose-ul:pl-6"
                            dangerouslySetInnerHTML={{ __html: contentWithIds }}
                        />


                        <div className="mt-24">
                            <AuthorInfo author={activePost.author} />
                        </div>

                        <CommentSection postId={activePost._id} />
                    </article>

                    {/* Right Rail: TOC & Social */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-32 space-y-12">
                            {/* Combined Engagement & Navigation */}
                            <div className="flex flex-col gap-8">
                                <div className="flex gap-4">
                                    <button onClick={handleLike} className={`flex-1 p-5 rounded-[24px] border transition-all shadow-sm flex flex-col items-center gap-2 ${liked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-100'}`}>
                                        <Heart size={22} fill={liked ? "currentColor" : "none"} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{activePost.likeCount || 0} Likes</span>
                                    </button>
                                    <button onClick={handleShare} className="flex-1 p-5 rounded-[24px] bg-white border border-gray-100 text-gray-400 hover:border-blue-100 transition-all shadow-sm flex flex-col items-center gap-2">
                                        <Share2 size={22} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Broadcast</span>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">
                                        <span>Architecture</span>
                                        <span className="flex items-center gap-1.5 text-blue-600/40">
                                            <Clock size={12} />
                                            {activePost.views || 0} Reads
                                        </span>
                                    </div>
                                    <nav className="space-y-4">
                                        {headers.map((h, i) => (
                                            <a
                                                key={i}
                                                href={`#${h.id}`}
                                                className={`block text-[13px] leading-relaxed font-bold transition-all hover:text-blue-600 hover:translate-x-1 ${h.level === 'h3' ? 'ml-6 text-gray-400 border-l border-gray-50 pl-4' : 'text-gray-600'}`}
                                            >
                                                {h.text}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
