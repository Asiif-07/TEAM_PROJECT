import React from 'react';

const BlogSkeleton = () => (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="aspect-[16/10] bg-slate-100" />
        <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 rounded bg-slate-100" />
            <div className="h-5 w-4/5 rounded bg-slate-100" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
            <div className="flex items-center gap-3 pt-3">
                <div className="h-8 w-8 rounded-full bg-slate-100" />
                <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
        </div>
    </div>
);

export default BlogSkeleton;
