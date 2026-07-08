import React, { useState, useEffect } from 'react';
import useBlogStore from '../../../store/useBlogStore';
import { S } from './styles';
import { X, Plus, ExternalLink, Check, Tag, Search, Eye } from 'lucide-react';

const SidebarPanels = () => {
    const { draft, updateDraft, categories, fetchCategories } = useBlogStore();
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [showMeta, setShowMeta] = useState(false);

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
                <h4 className={S.cardTitle}><Eye size={14} className="text-[#2563EB]" /> Post Status</h4>
                <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${draft.isPublic ? 'bg-green-400' : 'bg-amber-400'}`} />
                    <span className="text-sm font-bold text-gray-700">{draft.isPublic ? 'Public' : 'Draft'}</span>
                    <button onClick={() => updateDraft({ isPublic: !draft.isPublic })}
                        className="ml-auto text-[11px] text-[#2563EB] font-bold hover:underline transition-colors">
                        Switch to {draft.isPublic ? 'Draft' : 'Public'}
                    </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                    {draft.lastSaved ? `Last saved: ${new Date(draft.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Last saved: Just now'}
                </p>
            </div>

            <div className={S.card}>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <Plus size={14} className="text-[#2563EB]" /> Categories
                    </h4>
                </div>
                <div className="space-y-1.5">
                    {categories.map(cat => (
                        <div key={cat._id} onClick={() => updateDraft({ category: cat.name })}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ${draft.category === cat.name ? 'bg-blue-50 border border-blue-100' : 'border border-transparent hover:bg-gray-50'}`}>
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${draft.category === cat.name ? 'bg-[#2563EB] border-[#2563EB]' : 'border-gray-300'}`}>
                                {draft.category === cat.name && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-base mr-1">{cat.icon}</span>
                            <span className={`text-sm transition-colors ${draft.category === cat.name ? 'text-[#2563EB] font-bold' : 'text-gray-600 font-medium'}`}>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className={S.card}>
                <h4 className={S.cardTitle}><Tag size={14} className="text-[#2563EB]" /> Tags</h4>
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type tag & press Enter…"
                    className={S.input}
                />
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map(tag => (
                            <span key={tag} className={S.tag}>
                                {tag}
                                <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* SEO */}
            <div className={S.card}>
                <h4 className={S.cardTitle}><Search size={14} className="text-[#2563EB]" /> SEO Preview</h4>
                <div className="bg-white rounded-2xl p-4 space-y-1.5 border border-black/5">
                    <p className="text-[#1a0dab] text-sm font-bold truncate">{draft.title || 'Post Title'} - CareerForge Blog</p>
                    <p className="text-[#006621] text-[11px] font-medium truncate">careerforge.com/blog/{slug}</p>
                    <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
                        {draft.seoDescription || 'This is a preview of how your post will appear in search engine results...'}
                    </p>
                </div>
                {showMeta ? (
                    <div className="mt-3 space-y-1">
                        <textarea
                            value={draft.seoDescription}
                            onChange={(e) => updateDraft({ seoDescription: e.target.value })}
                            placeholder="Write a compelling meta description…"
                            rows={2}
                            maxLength={160}
                            className={`${S.input} resize-none`}
                        />
                        <p className="text-right text-[10px] text-gray-400 font-medium">{draft.seoDescription?.length || 0}/160</p>
                    </div>
                ) : (
                    <button onClick={() => setShowMeta(true)} className="flex items-center gap-1.5 text-[#2563EB] text-[11px] font-bold mt-3 hover:underline">
                        <ExternalLink size={12} /> Edit Meta Description
                    </button>
                )}
            </div>
        </>
    );
};

export default SidebarPanels;
