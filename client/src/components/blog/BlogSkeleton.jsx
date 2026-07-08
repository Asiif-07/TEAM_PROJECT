import React from 'react';

const BlogSkeleton = () => {
    return (
        <div className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="h-56 bg-gray-200" />
            <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="pt-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                        <div className="h-3 bg-gray-200 rounded w-32" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogSkeleton;
