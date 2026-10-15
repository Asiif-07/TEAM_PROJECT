import React, { useState, useEffect } from 'react';
import useBlogStore from '../../../store/useBlogStore';
import { S } from './styles';
import { X, Check, Tag, Search, Eye, FolderOpen } from 'lucide-react';

const SidebarPanels = ({ categoryError }) => {
    const { draft, updateDraft, categories, fetchCategories } = useBlogStore();
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (!categories.length) fetchCategories();
    }, [categories.length, fetchCategories]);

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const slug = draft.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'post-title';

    return (
        <>
            {/* Post Status */}
            <div className={S.card}>
                <h4 className={S.cardTitle}><Eye size={15} className="text-blue-600" /> Visibility</h4>
                <div className="mt-3 flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${draft.isPublic ? 'bg-green-500' : 'bg-amber-400'}`} />
                    <span className="text-sm font-semibold text-slate-800">{draft.isPublic ? 'Public' : 'Draft'}</span>
                    <button
                        type="button"
                        onClick={() => updateDraft({ isPublic: !draft.isPublic })}
                        className="ml-auto text-xs font-semibold text-blue-600 hover:underline"
                    >
                        Switch to {draft.isPublic ? 'Draft' : 'Public'}
                    </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    {draft.lastSaved
                        ? `Last saved ${new Date(draft.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : 'Not saved yet'}
                </p>
            </div>

            {/* Categories */}
            <div className={`${S.card} ${categoryError ? 'border-red-300' : ''}`} id="post-category">
                <h4 className={S.cardTitle}>
                    <FolderOpen size={15} className="text-blue-600" /> Category <span className="text-red-500">*</span>
                </h4>
                <p className={S.cardHint}>Pick the one that fits your article best.</p>
                <div role="radiogroup" aria-label="Category" className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                        const selected = draft.category === cat.name;
                        return (
                            <button
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                key={cat._id}
                                onClick={() => updateDraft({ category: cat.name })}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                    selected
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
                                }`}
                            >
                                {selected ? <Check size={14} strokeWidth={3} /> : cat.icon && <span>{cat.icon}</span>}
                                {cat.name}
                            </button>
                        );
                    })}
                    {categories.length === 0 && <p className="text-xs text-slate-400">Loading categories…</p>}
                </div>
                {categoryError && <p role="alert" className={S.error}>{categoryError}</p>}
            </div>

            {/* Tags */}
            <div className={S.card}>
                <h4 className={S.cardTitle}><Tag size={15} className="text-blue-600" /> Tags</h4>
                <p className={S.cardHint}>Press Enter to add. Tags are for your reference and are not saved with the article yet.</p>
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="e.g. resume, interviews"
                    aria-label="Add a tag"
                    className={S.input}
                />
                {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span key={tag} className={S.tag}>
                                {tag}
                                <button type="button" aria-label={`Remove ${tag}`} onClick={() => setTags(tags.filter((t) => t !== tag))} className="transition-colors hover:text-red-500">
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* SEO */}
            <div className={S.card}>
                <h4 className={S.cardTitle}><Search size={15} className="text-blue-600" /> Search preview</h4>
                <p className={S.cardHint}>How your article may look in search results.</p>
                <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="truncate text-sm font-semibold text-[#1a0dab]">{draft.title || 'Post title'} - CareerForge Blog</p>
                    <p className="truncate text-xs text-[#006621]">careerforge.com/blog/{slug}</p>
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {draft.seoDescription || 'Add a short description below to control this snippet.'}
                    </p>
                </div>
                <label htmlFor="meta-description" className="mt-3 block text-xs font-semibold text-slate-700">Meta description</label>
                <textarea
                    id="meta-description"
                    value={draft.seoDescription}
                    onChange={(e) => updateDraft({ seoDescription: e.target.value })}
                    placeholder="A compelling 1–2 sentence summary…"
                    rows={2}
                    maxLength={160}
                    className={`${S.input} mt-1 resize-none`}
                />
                <p className="mt-1 text-right text-[11px] text-slate-400">{draft.seoDescription?.length || 0}/160</p>
            </div>
        </>
    );
};

export default SidebarPanels;
