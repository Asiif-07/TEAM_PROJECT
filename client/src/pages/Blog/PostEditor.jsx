import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Eye, EyeOff, Send, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
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
    const [errors, setErrors] = useState([]);
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

    const saveDraft = () => updateDraft({ lastSaved: new Date().toISOString(), isPublic: false });

    const publish = async () => {
        setErrors([]);
        const v = schema.safeParse(draft);
        if (!v.success) return setErrors(v.error.issues.map(e => e.message));

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
            toast.error(e.message || "Failed to publish post");
        }
    };

    // Preview Mode
    if (preview) return (
        <div className={S.page}>
            <div className={S.topBar}>
                <h1 className="text-2xl font-black text-gray-900">Live Preview</h1>
                <button onClick={() => setPreview(false)} className={S.btnDraft}><EyeOff size={16} className="mr-2" />Back to Editor</button>
            </div>
            <article className="max-w-3xl mx-auto py-12 px-6">
                {draft.images.length > 0 && (
                    <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-10 border border-black/5 shadow-xl">
                        <img src={URL.createObjectURL(draft.images[0])} className="w-full h-full object-cover" alt="" />
                    </div>
                )}
                <span className="bg-blue-50 text-[#2563EB] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl">{draft.category}</span>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mt-6 mb-10">{draft.title || "Untitled"}</h1>
                <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: draft.content }} />
            </article>
        </div>
    );

    return (
        <div className={S.page}>
            {/* Header (matches CVBuilder header) */}
            <div className={S.topBar}>
                <div className="text-center flex-1">
                    <h1 className="text-2xl lg:text-4xl font-black text-gray-900">{slug ? 'Edit Your Post' : 'Create Your Post'}</h1>
                    <p className="text-sm text-gray-400 mt-1 font-medium">Craft something worth reading</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={saveDraft} className={S.btnDraft}>Save Draft</button>
                    <button onClick={() => setPreview(true)} className={S.btnDraft}><Eye size={16} /></button>
                    <button onClick={publish} disabled={loading} className={S.btnPublish}>
                        {loading ? <><Loader2 size={16} className="animate-spin mr-1" />Saving…</> : slug ? <><Sparkles size={16} className="mr-1" />Update</> : <><Send size={16} className="mr-1" />Publish</>}
                    </button>
                </div>
            </div>

            {/* Body */}
            <PostDesigner validationErrors={errors} />
        </div>
    );
};

export default PostEditor;
