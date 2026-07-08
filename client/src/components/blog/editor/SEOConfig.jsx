import React, { useState } from 'react';
import useBlogStore from '../../../store/useBlogStore';
import { Link2, X, Hash } from 'lucide-react';

const categories = ["Career Advice", "Resume Tips", "Interview Prep", "Industry Trends"];

const SEOConfig = () => {
    const { draft, updateDraft } = useBlogStore();
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tag) => setTags(tags.filter(t => t !== tag));

    const slugPreview = draft.title
        ? draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : '';

    return (
        <div className="space-y-5">
            {/* Category */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</h4>
                <div className="flex flex-wrap gap-1.5">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => updateDraft({ category: cat })}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${draft.category === cat
                                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md shadow-violet-200/50'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags</h4>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 bg-violet-50 text-violet-600 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-violet-100">
                                <Hash size={10} />
                                {tag}
                                <button onClick={() => removeTag(tag)} className="ml-0.5 hover:text-red-500"><X size={10} /></button>
                            </span>
                        ))}
                    </div>
                )}
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type & press Enter..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder:text-gray-400"
                />
            </div>

            {/* URL Slug */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">URL Slug</h4>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <span className="px-2.5 py-2 text-gray-400"><Link2 size={14} /></span>
                    <span className="text-xs text-gray-400 font-medium pr-1">/blog/</span>
                    <input
                        type="text"
                        readOnly
                        value={slugPreview}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-semibold text-violet-600 py-2 pr-3"
                    />
                </div>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Description</h4>
                    <span className="text-[10px] text-gray-400 font-medium">{draft.seoDescription?.length || 0}/160</span>
                </div>
                <textarea
                    value={draft.seoDescription}
                    onChange={(e) => updateDraft({ seoDescription: e.target.value })}
                    placeholder="Describe this post for search engines..."
                    rows={2}
                    maxLength={160}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none placeholder:text-gray-400"
                />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visibility</h4>
                <div className="flex gap-2">
                    {[
                        { label: 'Public', value: true },
                        { label: 'Draft', value: false }
                    ].map(opt => (
                        <button
                            key={opt.label}
                            onClick={() => updateDraft({ isPublic: opt.value })}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${draft.isPublic === opt.value
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SEOConfig;
