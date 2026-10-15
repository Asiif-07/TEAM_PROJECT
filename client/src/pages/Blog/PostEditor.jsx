import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Eye, EyeOff, Send, Sparkles, Loader2, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import useBlogStore from '../../store/useBlogStore';
import { useAuth } from '../../context/AuthContext';
import PostDesigner from '../../components/blog/editor/PostDesigner';
import { S } from '../../components/blog/editor/styles';

const schema = z.object({
    title: z.string().min(5, "Title: at least 5 characters"),
    content: z.string().min(20, "Content: at least 20 characters"),
    category: z.string().min(1, "Select a category"),
});

const PostEditor = () => {
    const { draft, updateDraft, resetDraft, updatePost, createPost, fetchPostBySlug, loading, posts, activePost } = useBlogStore();
    const { accessToken, refreshAccessToken } = useAuth();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [attempted, setAttempted] = useState(false);
    const [preview, setPreview] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (slug) {
            const p = posts.find(x => x.slug === slug);
            if (p) {
                updateDraft({
                    title: p.title,
                    content: p.content,
                    category: p.category,
                    seoDescription: p.seoDescription || "",
                    images: [] // Reset images for edit
                });
            } else {
                // If not in store, fetch from API
                fetchPostBySlug(slug);
            }
        } else {
            resetDraft();
        }
    }, [slug, posts]); // eslint-disable-line

    // Sync draft if activePost changes (for direct navigation/refresh)
    useEffect(() => {
        if (slug && activePost && activePost.slug === slug) {
            updateDraft({
                title: activePost.title,
                content: activePost.content,
                category: activePost.category,
                seoDescription: activePost.seoDescription || "",
                images: []
            });
        }
    }, [activePost, slug]); // eslint-disable-line

    useEffect(() => {
        timerRef.current = setInterval(() => {
            if (draft.title || draft.content) updateDraft({ lastSaved: new Date().toISOString() });
        }, 60000);
        return () => clearInterval(timerRef.current);
    }, [draft.title, draft.content, updateDraft]);

    // Object URL for the preview cover (created once per file)
    const cover = draft.images[0];
    const previewUrl = useMemo(() => (preview && cover ? URL.createObjectURL(cover) : ''), [preview, cover]);

    // Field-level errors, shown after the first publish attempt and kept live while fixing them
    const fieldErrors = useMemo(() => {
        if (!attempted) return {};
        const v = schema.safeParse(draft);
        if (v.success) return {};
        const out = {};
        v.error.issues.forEach((i) => {
            const key = i.path[0];
            if (!out[key]) out[key] = i.message;
        });
        return out;
    }, [attempted, draft]);
    const errorCount = Object.keys(fieldErrors).length;

    const saveDraft = () => {
        updateDraft({ lastSaved: new Date().toISOString(), isPublic: false });
        toast.success("Draft saved. It stays in this editor until you publish.");
    };

    const publish = async () => {
        setAttempted(true);
        const v = schema.safeParse(draft);
        if (!v.success) {
            const first = v.error.issues[0]?.path[0];
            const target = first === 'category' ? document.getElementById('post-category')
                : first === 'content' ? document.querySelector('.quill-editor-cms')
                    : document.getElementById('post-title');
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const fd = new FormData();
        fd.append('title', draft.title);
        fd.append('content', draft.content);
        fd.append('category', draft.category);
        if (draft.seoDescription) fd.append('seoDescription', draft.seoDescription);
        if (draft.images.length) {
            fd.append('coverImage', draft.images[0]);
            draft.images.slice(1).forEach((img) => fd.append('bodyImages', img));
        }

        try {
            if (slug) {
                const ex = posts.find(x => x.slug === slug);
                if (ex) {
                    await updatePost(ex._id, fd, { accessToken, refreshAccessToken });
                    toast.success("Post updated successfully!");
                }
            } else {
                await createPost(fd, { accessToken, refreshAccessToken });
                toast.success("Post published successfully!");
            }
            resetDraft();
            navigate('/blogs');
        } catch (e) {
            console.error(e);
            if (!e.toasted) toast.error(e.message || "Failed to publish post");
        }
    };

    // Preview Mode
    if (preview) return (
        <div className={S.page}>
            <div className={`${S.topBar} flex items-center justify-between gap-4`}>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Preview</h1>
                    <p className="text-sm text-slate-500">This is how your article will look.</p>
                </div>
                <button type="button" onClick={() => setPreview(false)} className={S.btnDraft}>
                    <EyeOff size={16} />Back to editor
                </button>
            </div>
            <article className="mx-auto max-w-3xl px-4 sm:px-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-10">
                    {previewUrl && (
                        <div className="mb-8 aspect-video overflow-hidden rounded-2xl border border-slate-100 sm:aspect-[21/9]">
                            <img src={previewUrl} className="h-full w-full object-cover" alt="" />
                        </div>
                    )}
                    {draft.category && (
                        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                            {draft.category}
                        </span>
                    )}
                    <h1 className="mt-4 mb-8 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 [overflow-wrap:anywhere] sm:text-4xl">
                        {draft.title || "Untitled"}
                    </h1>
                    <div className="article-content" dangerouslySetInnerHTML={{ __html: draft.content }} />
                </div>
            </article>
        </div>
    );

    return (
        <div className={S.page}>
            {/* Header */}
            <div className={S.topBar}>
                <Link to="/blogs" className="group mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to Blog
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        {slug ? 'Edit your article' : 'Write a new article'}
                    </h1>
                    <p className="text-sm text-slate-500">
                        Fields marked <span className="text-red-500">*</span> are required to publish.
                    </p>
                </div>
                {errorCount > 0 && (
                    <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        Please fix {errorCount} {errorCount === 1 ? 'issue' : 'issues'} before publishing.
                    </div>
                )}
            </div>

            {/* Body */}
            <PostDesigner fieldErrors={fieldErrors} />

            {/* Action bar */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                    <p className="hidden truncate text-sm text-slate-500 sm:block">
                        {draft.lastSaved
                            ? `Draft saved at ${new Date(draft.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : 'Your changes are kept while this page is open.'}
                    </p>
                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                        <button type="button" onClick={saveDraft} className={S.btnDraft}>
                            <Save size={16} />
                            Save draft
                        </button>
                        <button type="button" onClick={() => setPreview(true)} aria-label="Preview" className={S.btnDraft}>
                            <Eye size={16} />
                            <span className="hidden sm:inline">Preview</span>
                        </button>
                        <button type="button" onClick={publish} disabled={loading} className={S.btnPublish}>
                            {loading
                                ? <><Loader2 size={16} className="animate-spin" />Saving…</>
                                : slug
                                    ? <><Sparkles size={16} />Update</>
                                    : <><Send size={16} />Publish</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostEditor;
