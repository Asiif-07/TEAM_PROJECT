import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, PenTool } from 'lucide-react';
import useBlogStore from '../../store/useBlogStore';
import AuthorInfo from '../../components/blog/AuthorInfo';
import BlogSkeleton from '../../components/blog/BlogSkeleton';
import { formatDate, calculateReadingTime } from '../../utils/blogUtils';

const AuthorProfile = () => {
    const { id } = useParams();
    const { authorProfile, posts, fetchAuthorProfile, fetchPosts, loading } = useBlogStore();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAuthorProfile(id);
        fetchPosts(`author=${id}`);
    }, [id, fetchAuthorProfile, fetchPosts]);

    if (loading && !authorProfile) {
        return (
            <div className="min-h-screen bg-mesh pb-20 pt-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-64 bg-white/50 backdrop-blur-sm rounded-[40px] animate-pulse mb-12"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[...Array(4)].map((_, i) => <BlogSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    // Only show "not found" after loading completes.
    // During navigation/fetch failures, authorProfile may be temporarily undefined/null.
    if (!loading && !authorProfile) return (
        <div className="min-h-screen flex items-center justify-center bg-mesh">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-black text-gray-300 uppercase tracking-widest">Author Not Found</h2>
                <button onClick={() => navigate('/blogs')} className="text-blue-600 font-bold hover:underline">Return to Blog Feed</button>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-mesh pb-20 pt-10 animate-fade-in-up">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Author Header Card */}
                <div className="mb-20">
                    <AuthorInfo author={authorProfile.user ? { ...authorProfile.user, blogProfile: authorProfile } : null} />
                </div>

                {/* Articles Section */}
                <div className="space-y-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-8 gap-4">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                                Articles by <span className="premium-text-gradient">{authorProfile.displayName || authorProfile.user?.name}</span>
                            </h2>
                            <p className="text-gray-400 font-medium tracking-tight">Exploring the latest insights and guides.</p>
                        </div>
                        <span className="shrink-0 w-fit px-5 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100">
                            {posts?.length || 0} Articles
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {posts?.map((post) => (
                            <div
                                key={post._id}
                                onClick={() => navigate(`/blogs/${post.slug}`)}
                                className="group bg-white rounded-[40px] overflow-hidden border border-transparent hover:border-blue-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={post.coverImage?.secure_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-10 space-y-6">
                                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} />
                                            {calculateReadingTime(post.content)}
                                        </span>
                                        <span>•</span>
                                        <span>{formatDate(post.createdAt)}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                                        {post.title}
                                    </h3>
                                    <div className="pt-2 flex items-center justify-between">
                                        <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-2">
                                            Read Article <ChevronRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {posts?.length === 0 && !loading && (
                        <div className="py-32 text-center bg-white/50 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-gray-100">
                            <PenTool className="mx-auto text-gray-200 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-400 tracking-tight">This author hasn't published any articles yet.</h3>
                            <p className="text-gray-300 mt-2">Check back later for fresh content!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorProfile;
