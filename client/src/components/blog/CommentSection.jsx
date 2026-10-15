import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as commentApi from "../../api/comments";
import { MessageCircle, Reply, Send, Trash2, ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const MAX_LENGTH = 1000;

const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

// Returns an error message or "" for a valid comment body.
const validate = (text) => {
    const v = text.trim();
    if (!v) return "Please write something first.";
    if (v.length > MAX_LENGTH) return `Comments are limited to ${MAX_LENGTH} characters.`;
    return "";
};

// ─── Single comment + its replies ─────────────────────────────────────
// `threadRootId` is the top-level comment of the thread. Replies to replies are attached
// to it (the API keeps threads two levels deep), so the UI always shows them.
const CommentItem = ({ comment, postId, threadRootId, onAddReply, onDelete, currentUser, accessToken, refreshAccessToken }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyError, setReplyError] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const avatar = comment.author?.profileImage?.secure_url;
    const initials = comment.author?.name?.[0]?.toUpperCase() || "?";
    const isOwn = currentUser && comment.author?._id === currentUser._id;
    const rootId = threadRootId || comment._id;
    const replies = Array.isArray(comment.replies) ? comment.replies.filter((r) => r && typeof r === "object") : [];

    const handleSubmitReply = async () => {
        if (loading) return;
        const message = validate(replyText);
        if (message) {
            setReplyError(message);
            return;
        }
        setLoading(true);
        setReplyError("");
        try {
            const newReply = await commentApi.addComment(postId, replyText.trim(), comment._id, {
                accessToken,
                refreshAccessToken,
                showToast: false,
            });
            onAddReply(rootId, newReply);
            setReplyText("");
            setShowReplyBox(false);
            setShowReplies(true);
        } catch (err) {
            setReplyError(err?.message || "Failed to post reply");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleting) return;
        if (!window.confirm("Delete this comment? This cannot be undone.")) return;
        setDeleting(true);
        try {
            await onDelete(comment._id, rootId);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <div className="flex gap-3 sm:gap-4">
                <div className="shrink-0">
                    {avatar ? (
                        <img src={avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {initials}
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-slate-900">{comment.author?.name || "Anonymous"}</span>
                            <span className="shrink-0 text-xs text-slate-400">{timeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere]">{comment.content}</p>
                    </div>

                    <div className="mt-1.5 flex items-center gap-4 px-1">
                        {currentUser && (
                            <button
                                type="button"
                                onClick={() => setShowReplyBox(!showReplyBox)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-600"
                            >
                                <Reply size={13} />
                                Reply
                            </button>
                        )}
                        {replies.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowReplies(!showReplies)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-blue-600"
                            >
                                {showReplies ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                {replies.length} {replies.length === 1 ? "reply" : "replies"}
                            </button>
                        )}
                        {isOwn && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                aria-label="Delete comment"
                                className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50"
                            >
                                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                            </button>
                        )}
                    </div>

                    {showReplyBox && (
                        <div className="mt-3">
                            <div className="flex gap-2">
                                <input
                                    value={replyText}
                                    maxLength={MAX_LENGTH + 50}
                                    onChange={(e) => {
                                        setReplyText(e.target.value);
                                        if (replyError) setReplyError("");
                                    }}
                                    placeholder="Write a reply..."
                                    aria-label="Write a reply"
                                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmitReply()}
                                />
                                <button
                                    type="button"
                                    onClick={handleSubmitReply}
                                    disabled={loading || !replyText.trim()}
                                    aria-label="Send reply"
                                    className="rounded-xl bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 disabled:opacity-40"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                </button>
                            </div>
                            {replyError && <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{replyError}</p>}
                        </div>
                    )}

                    {showReplies && replies.length > 0 && (
                        <div className="mt-4 space-y-4 border-l-2 border-slate-100 pl-3 sm:pl-4">
                            {replies.map((reply) => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    postId={postId}
                                    threadRootId={rootId}
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
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setLoadError("");
        try {
            const data = await commentApi.getComments(postId, { showToast: false });
            setComments(Array.isArray(data) ? data : []);
        } catch (err) {
            setLoadError(err?.message || "Failed to load comments");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const totalCount = comments.reduce((n, c) => n + 1 + (c.replies?.length || 0), 0);

    const handleSubmit = async () => {
        if (submitting) return;
        const message = validate(newComment);
        if (message) {
            setFormError(message);
            return;
        }
        setSubmitting(true);
        setFormError("");
        try {
            const comment = await commentApi.addComment(postId, newComment.trim(), null, {
                accessToken,
                refreshAccessToken,
                showToast: false,
            });
            setComments((prev) => [{ ...comment, replies: comment.replies || [] }, ...prev]);
            setNewComment("");
        } catch (err) {
            setFormError(err?.message || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    // `rootId` is the thread's top-level comment (replies to replies are stored under it).
    const handleAddReply = (rootId, reply) => {
        setComments((prev) =>
            prev.map((c) => (c._id === rootId ? { ...c, replies: [...(c.replies || []), reply] } : c))
        );
    };

    const handleDelete = async (commentId, rootId) => {
        try {
            await commentApi.deleteComment(postId, commentId, {
                accessToken,
                refreshAccessToken,
                showToast: false,
            });
            setComments((prev) =>
                commentId === rootId
                    ? prev.filter((c) => c._id !== commentId)
                    : prev.map((c) =>
                          c._id === rootId ? { ...c, replies: (c.replies || []).filter((r) => r._id !== commentId) } : c
                      )
            );
        } catch (err) {
            toast.error(err?.message || "Failed to delete comment");
        }
    };

    const remaining = MAX_LENGTH - newComment.length;

    return (
        <section id="comments" className="mt-14 space-y-8 border-t border-slate-100 pt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Comments</h3>
                    <p className="text-sm text-slate-500">Share your thoughts and join the conversation.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
                    <MessageCircle size={15} />
                    {totalCount} {totalCount === 1 ? "comment" : "comments"}
                </div>
            </div>

            {isAuthenticated ? (
                <div className="flex gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {user?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                        <textarea
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value);
                                if (formError) setFormError("");
                            }}
                            placeholder="Write a comment..."
                            aria-label="Write a comment"
                            rows={3}
                            disabled={submitting}
                            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                        />
                        <div className="flex items-center justify-between gap-3">
                            <span className={`text-xs ${remaining < 0 ? "font-semibold text-red-600" : "text-slate-400"}`}>
                                {remaining < 0 ? `${-remaining} over the limit` : `${remaining} characters left`}
                            </span>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || !newComment.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                                {submitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                        {formError && <p role="alert" className="text-sm font-medium text-red-600">{formError}</p>}
                    </div>
                </div>
            ) : (
                <div className="space-y-3 rounded-2xl bg-slate-50 p-6 text-center">
                    <MessageCircle size={26} className="mx-auto text-blue-600" />
                    <p className="text-sm font-medium text-slate-600">Sign in to join the conversation</p>
                    <Link
                        to="/login"
                        state={{ from: window.location.pathname }}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Sign In
                    </Link>
                </div>
            )}

            {loading ? (
                <div className="space-y-5" aria-busy="true">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex animate-pulse gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 rounded-lg bg-slate-100" />
                                <div className="h-12 rounded-2xl bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : loadError ? (
                <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                    <p className="text-sm font-medium text-red-700">{loadError}</p>
                    <button
                        type="button"
                        onClick={fetchComments}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-100"
                    >
                        <RefreshCw size={14} />
                        Try again
                    </button>
                </div>
            ) : comments.length === 0 ? (
                <div className="space-y-2 py-10 text-center text-slate-400">
                    <MessageCircle size={32} className="mx-auto opacity-40" />
                    <p className="text-sm font-medium">No comments yet. Be the first to share your thoughts.</p>
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
