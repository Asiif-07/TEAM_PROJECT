import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, Plus } from 'lucide-react';
import useBlogStore from '../../store/useBlogStore';
import { formatDate } from '../../utils/blogUtils';
import { useAuth } from '../../context/AuthContext';

const MyBlogs = () => {
    const { myPosts, fetchMyPosts, deletePost, loading } = useBlogStore();
    const { accessToken, refreshAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyPosts({ accessToken, refreshAccessToken });
    }, [fetchMyPosts, accessToken, refreshAccessToken]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this article?")) {
            await deletePost(id, { accessToken, refreshAccessToken });
        }
    };

    if (loading && myPosts?.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">My Articles</h3>
                    <p className="text-sm text-gray-500">Manage your published blog posts</p>
                </div>
                <button
                    onClick={() => navigate('/blogs/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={18} />
                    New Article
                </button>
            </div>

            {myPosts?.length > 0 ? (
                <div className="grid gap-4">
                    {myPosts.map((post) => (
                        <div
                            key={post._id}
                            onClick={() => navigate(`/blogs/${post.slug}`)}
                            className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                    <img
                                        src={post.coverImage?.secure_url}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                        <span>{post.category}</span>
                                        <span>•</span>
                                        <span>{formatDate(post.createdAt)}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate(`/blogs/edit/${post.slug}`); }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, post._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold mb-4">You haven't published any articles yet.</p>
                    <button
                        onClick={() => navigate('/blogs/create')}
                        className="text-blue-600 font-black uppercase tracking-widest text-xs hover:underline"
                    >
                        Start writing your first post
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyBlogs;
