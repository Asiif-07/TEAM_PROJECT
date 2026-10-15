import React from 'react';
import useBlogStore from '../../../store/useBlogStore';
import { S } from './styles';
import { calculateReadingTime } from '../../../utils/blogUtils';
import { Clock, Type } from 'lucide-react';

const DesignHeader = ({ error }) => {
    const { draft, updateDraft } = useBlogStore();
    const words = draft.content?.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length || 0;

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Editing
                    {draft.lastSaved && (
                        <span className="font-normal text-blue-600/80">
                            · saved {new Date(draft.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </span>
                <div className="flex items-center gap-4 font-medium">
                    <span className="flex items-center gap-1.5"><Clock size={14} />{calculateReadingTime(draft.content)}</span>
                    <span className="flex items-center gap-1.5"><Type size={14} />{words} words</span>
                </div>
            </div>

            <label htmlFor="post-title" className={S.label}>
                Title <span className="text-red-500">*</span>
            </label>
            <textarea
                id="post-title"
                value={draft.title}
                onChange={(e) => updateDraft({ title: e.target.value })}
                placeholder="Give your article a clear title"
                rows={1}
                aria-invalid={!!error}
                className={`${draft.title ? S.titleFilled : S.titleInput} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : ''}`}
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
            />
            {error ? <p role="alert" className={S.error}>{error}</p> : <p className="mt-1.5 text-xs text-slate-400">A clear, specific headline works best (at least 5 characters).</p>}
        </div>
    );
};

export default DesignHeader;
