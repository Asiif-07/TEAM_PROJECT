import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import * as commentApi from "../../api/comments";
import { MessageCircle, Reply, Send, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

// ─── Single comment + its replies ─────────────────────────────────────
const CommentItem = ({ comment, postId, onAddReply, onDelete, currentUser, accessToken, refreshAccessToken }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [loading, setLoading] = useState(false);

    const avatar = comment.author?.profileImage?.secure_url;
    const initials = comment.author?.name?.[0]?.toUpperCase() || "?";
    const isOwn = currentUser && comment.author?._id === currentUser._id;

    const handleSubmitReply = async () => {
        if (!replyText.trim()) return;
        setLoading(true);
        try {
            const newReply = await commentApi.addComment(postId, replyText.trim(), comment._id, {
                accessToken,
                refreshAccessToken,
            });
            onAddReply(comment._id, newReply);
            setReplyText("");
            setShowReplyBox(false);
            setShowReplies(true);
        } catch {
            toast.error("Failed to post reply");
        } finally {
            setLoading(false);
        }
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="group">
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                    {avatar ? (
                        <img src={avatar} alt={comment.author?.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-gray-100" />
                    ) : (
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-sm font-black">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-[20px] px-5 py-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-black text-gray-900 text-sm">{comment.author?.name || "Anonymous"}</span>
                            <span className="text-[10px] text-gray-400 font-medium shrink-0">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-2 px-2">
                        {currentUser && (
                            <button
                                onClick={() => setShowReplyBox(!showReplyBox)}
                                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <Reply size={12} />
                                Reply
                            </button>
                        )}
                        {comment.replies?.length > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                            </button>
                        )}
                        {isOwn && (
                            <button
                                onClick={() => onDelete(comment._id)}
                                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors ml-auto"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>

                    {/* Reply input */}
                    {showReplyBox && (
                        <div className="mt-3 flex gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                                {currentUser?.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 flex gap-2">
                                <input
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-100 focus:border-blue-300 transition-colors"
                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmitReply()}
                                />
                                <button
                                    onClick={handleSubmitReply}
                                    disabled={loading || !replyText.trim()}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-all"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Nested replies */}
                    {showReplies && comment.replies?.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    postId={postId}
                                    onAddReply={onAddReply}
                                    onDelete={onDelete}
                                    currentUser={currentUser}
                                    accessToken={accessToken}
                                    refreshAccessToken={refreshAccessToken}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Main CommentSection ───────────────────────────────────────────────
const CommentSection = ({ postId }) => {
    const { user, accessToken, refreshAccessToken, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const data = await commentApi.getComments(postId);
            setComments(data);
        } catch {
            toast.error("Failed to load comments");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const comment = await commentApi.addComment(postId, newComment.trim(), null, {
                accessToken,
                refreshAccessToken,
            });
            setComments((prev) => [comment, ...prev]);
            setNewComment("");
        } catch {
            toast.error("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddReply = (parentId, reply) => {
        setComments((prev) =>
            prev.map((c) =>
                c._id === parentId
                    ? { ...c, replies: [...(c.replies || []), reply] }
                    : c
            )
        );
    };

    const handleDelete = async (commentId) => {
        try {
            await commentApi.deleteComment(postId, commentId, {
                accessToken,
                refreshAccessToken,
            });
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        } catch {
            toast.error("Failed to delete comment");
        }
    };

    return (
        <section id="comments" className="mt-32 border-t border-gray-100 pt-16 space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Dialogue Board</h3>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Share Research & Perspectives</p>
                </div>
                <div className="flex items-center gap-2 px-5 py-2 bg-blue-50 rounded-xl">
                    <MessageCircle size={14} className="text-blue-600" />
                    <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
                </div>
            </div>

            {/* New comment box */}
            {isAuthenticated ? (
                <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shrink-0">
                        {user?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 space-y-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts, research, or perspective..."
                            rows={3}
                            className="w-full bg-gray-50 rounded-[20px] px-6 py-4 text-sm outline-none border border-gray-100 focus:border-blue-300 transition-colors resize-none text-gray-700"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !newComment.trim()}
                                className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none"
                            >
                                <Send size={14} />
                                {submitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-[28px] p-8 text-center space-y-4">
                    <MessageCircle size={28} className="text-blue-600 mx-auto" />
                    <p className="text-gray-600 font-medium text-sm">Sign in to join the dialogue</p>
                    <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl transition-all">
                        Sign In
                    </a>
                </div>
            )}

            {/* Comments list */}
            {loading ? (
                <div className="space-y-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-2xl bg-gray-100 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
                                <div className="h-12 bg-gray-100 rounded-[20px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-16 text-gray-400 space-y-3">
                    <MessageCircle size={36} className="mx-auto opacity-30" />
                    <p className="font-medium text-sm">No comments yet. Be the first to start the dialogue.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            postId={postId}
                            onAddReply={handleAddReply}
                            onDelete={handleDelete}
                            currentUser={user}
                            accessToken={accessToken}
                            refreshAccessToken={refreshAccessToken}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default CommentSection;
