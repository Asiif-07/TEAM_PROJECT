import React from 'react';
import useBlogStore from '../../../store/useBlogStore';
import { S } from './styles';
import { calculateReadingTime } from '../../../utils/blogUtils';
import { Clock, Zap } from 'lucide-react';

const DesignHeader = () => {
    const { draft, updateDraft } = useBlogStore();
    const words = draft.content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0;

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 bg-blue-50 text-[#2563EB] text-[10px] font-extrabold uppercase tracking-[0.15em] px-4 py-2 rounded-2xl border border-blue-100">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                    Editing
                </span>
                {draft.lastSaved && (
                    <span className="text-xs text-gray-400 font-medium">
                        Saved {new Date(draft.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
                <div className="ml-auto flex items-center gap-5 text-xs text-gray-400 font-semibold">
                    <span className="flex items-center gap-1.5"><Clock size={14} />{calculateReadingTime(draft.content)}</span>
                    <span className="flex items-center gap-1.5"><Zap size={14} />{words} words</span>
                </div>
            </div>

            {/* Title */}
            <textarea
                value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
                placeholder="Enter your post title…"
                rows={1}
                className={draft.title ? S.titleFilled : S.titleInput}
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
            />
        </div>
    );
};

export default DesignHeader;
