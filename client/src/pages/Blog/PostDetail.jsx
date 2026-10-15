import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart, Share2, ArrowLeft, Clock, Calendar, Eye } from 'lucide-react';
import useBlogStore from '../../store/useBlogStore';
import AuthorInfo from '../../components/blog/AuthorInfo';
import BlogCarousel from '../../components/blog/BlogCarousel';
import CommentSection from '../../components/blog/CommentSection';
import { formatDate, calculateReadingTime } from '../../utils/blogUtils';
import toast from 'react-hot-toast';

const PostDetailSkeleton = () => (
    <div className="min-h-screen bg-white pb-24 animate-pulse">
        <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
            <div className="mb-8 h-4 w-32 rounded-md bg-slate-100" />
            <div className="mb-4 h-7 w-28 rounded-full bg-slate-100" />
            <div className="mb-3 h-10 w-full rounded-xl bg-slate-100" />
            <div className="mb-8 h-10 w-4/5 rounded-xl bg-slate-100" />
            <div className="mb-8 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-slate-100" />
                <div className="space-y-2">
                    <div className="h-3 w-32 rounded bg-slate-100" />
                    <div className="h-3 w-44 rounded bg-slate-100" />
                </div>
            </div>
            <div className="mb-10 aspect-video w-full rounded-2xl bg-slate-100" />
            <div className="space-y-4">
                {[100, 100, 85, 100, 70].map((w, i) => (
                    <div key={i} className="h-4 rounded bg-slate-100" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    </div>
);

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
            const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
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
            toast.error('Please log in to like this article.');
            return;
        }
        likePost(activePost._id, { accessToken, refreshAccessToken });
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: activePost.title, url }).catch(() => {
                navigator.clipboard.writeText(url);
                toast.success('Link copied!');
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied!');
        }
    };

    const headers = [];
    const contentWithIds = (activePost.content || '').replace(/<(h[23])>(.*?)<\/h[23]>/g, (match, tag, text) => {
        // Strip tags and decode entities for the TOC display text
        const rawText = text.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
        const id = rawText.toLowerCase().replace(/[^\w]/g, '-');
        headers.push({ id, text: rawText, level: tag });
        return `<${tag} id="${id}" class="scroll-mt-32">${text}</${tag}>`;
    });

    const carouselImages = activePost.bodyImages?.length > 0
        ? [activePost.coverImage, ...activePost.bodyImages]
        : [activePost.coverImage];
    const hasCover = carouselImages.some((img) => img?.secure_url || typeof img === 'string');

    const author = activePost.author;
    const authorName = author?.blogProfile?.displayName || author?.name;
    const authorAvatar = author?.blogProfile?.avatar?.secure_url || author?.profileImage?.secure_url;

    const actionBtn = (active) =>
        `inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            active
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
        }`;

    return (
        <div className="relative min-h-screen bg-white pb-24 animate-fade-in">
            {/* Reading Progress */}
            <div className="fixed left-0 top-0 z-[100] h-1 w-full bg-slate-100">
                <div id="reading-progress" className="h-full bg-blue-600 transition-all duration-300" />
            </div>

            {/* Sticky action bar (appears after scrolling) */}
            <div
                className={`fixed left-0 top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl transition-all duration-300 ${
                    scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
                }`}
            >
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
                    <h2 className="min-w-0 truncate text-sm font-bold text-slate-900">{activePost.title}</h2>
                    <div className="flex shrink-0 items-center gap-2">
                        <button type="button" onClick={handleLike} aria-label="Like" className={actionBtn(liked)}>
                            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                            <span className="hidden sm:inline">{activePost.likeCount || 0}</span>
                        </button>
                        <button type="button" onClick={handleShare} aria-label="Share" className={actionBtn(false)}>
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
                <Link
                    to="/blogs"
                    className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
                >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to Blog
                </Link>

                <div className="flex flex-col gap-12 lg:flex-row lg:gap-14">
                    {/* Article */}
                    <article className="mx-auto w-full min-w-0 max-w-3xl flex-1">
                        <header className="mb-8">
                            {activePost.category && (
                                <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                                    {activePost.category}
                                </span>
                            )}
                            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 [overflow-wrap:anywhere] sm:text-4xl lg:text-[2.75rem]">
                                {activePost.title}
                            </h1>

                            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-slate-100 py-4">
                                {author && (
                                    <Link to={`/author/${author._id}`} className="group flex min-w-0 items-center gap-3">
                                        {authorAvatar ? (
                                            <img src={authorAvatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                                        ) : (
                                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                {authorName?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                                                {authorName}
                                            </span>
                                            <span className="block text-xs text-slate-500">Author</span>
                                        </span>
                                    </Link>
                                )}
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar size={15} />
                                        {formatDate(activePost.createdAt)}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock size={15} />
                                        {calculateReadingTime(activePost.content || '')}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Eye size={15} />
                                        {activePost.views || 0}
                                    </span>
                                </div>
                            </div>
                        </header>

                        {hasCover && (
                            <div className="mb-10 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                                <BlogCarousel images={carouselImages} />
                            </div>
                        )}

                        <div className="article-content" dangerouslySetInnerHTML={{ __html: contentWithIds }} />

                        {/* Engagement (always visible, incl. mobile) */}
                        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
                            <button type="button" onClick={handleLike} className={actionBtn(liked)}>
                                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                                {activePost.likeCount || 0} {activePost.likeCount === 1 ? 'Like' : 'Likes'}
                            </button>
                            <button type="button" onClick={handleShare} className={actionBtn(false)}>
                                <Share2 size={16} />
                                Share
                            </button>
                        </div>

                        <div className="mt-10">
                            <AuthorInfo author={activePost.author} />
                        </div>

                        <CommentSection postId={activePost._id} />
                    </article>

                    {/* Right rail: table of contents */}
                    {headers.length > 0 && (
                        <aside className="hidden w-60 shrink-0 lg:block">
                            <nav aria-label="Table of contents" className="sticky top-28">
                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">On this page</p>
                                <ul className="space-y-2 border-l border-slate-100">
                                    {headers.map((h, i) => (
                                        <li key={i}>
                                            <a
                                                href={`#${h.id}`}
                                                className={`-ml-px block border-l-2 border-transparent py-0.5 text-sm leading-snug text-slate-500 transition hover:border-blue-500 hover:text-blue-600 ${
                                                    h.level === 'h3' ? 'pl-7' : 'pl-4'
                                                }`}
                                            >
                                                {h.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
