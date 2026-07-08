import React from 'react';
import { Clock, Zap } from 'lucide-react';
import useBlogStore from '../../../store/useBlogStore';
import { calculateReadingTime } from '../../../utils/blogUtils';

const EditorHeader = () => {
    const { draft, updateDraft } = useBlogStore();
    const wordCount = draft.content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0;

    return (
        <div className="space-y-10">
            {/* Status Row */}
            <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-500/10 to-blue-500/10 text-violet-600 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-violet-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                    Editing
                </span>
                {draft.lastSaved && (
                    <span className="text-[11px] text-gray-400 font-medium">
                        Saved {new Date(draft.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
                <div className="ml-auto flex items-center gap-5 text-[11px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {calculateReadingTime(draft.content)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Zap size={13} />
                        {wordCount} words
                    </span>
                </div>
            </div>

            {/* Title */}
            <textarea
                value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
                placeholder="Give your story a title..."
                rows={2}
                className="w-full text-[2.75rem] leading-[1.15] font-extrabold text-gray-900 placeholder:text-gray-200 border-none focus:ring-0 p-0 resize-none bg-transparent focus:outline-none tracking-tight"
            />
        </div>
    );
};

export default EditorHeader;
