import React from 'react';
import EditorHeader from './EditorHeader';
import MediaManager from './MediaManager';
import ContentEditor from './ContentEditor';
import SEOConfig from './SEOConfig';

const PostForm = ({ validationErrors, author }) => {
    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
            {/* === LEFT: The Writing Canvas === */}
            <div className="lg:col-span-8 bg-white overflow-y-auto">
                <div className="max-w-[720px] mx-auto px-6 md:px-10 py-14">
                    <EditorHeader />
                    <div className="mt-10 border-t border-gray-100 pt-8">
                        <ContentEditor />
                    </div>

                    {validationErrors?.length > 0 && (
                        <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-5 space-y-1">
                            {validationErrors.map((err, i) => (
                                <p key={i} className="text-[11px] font-semibold text-red-500 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                    {err}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* === RIGHT: The Control Panel === */}
            <div className="lg:col-span-4 bg-[#fafbfd] border-l border-gray-100 overflow-y-auto">
                <div className="p-6 space-y-8">
                    {/* Panel Title */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Publish Settings</h3>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">Configure before publishing</p>
                    </div>

                    {/* Media */}
                    <MediaManager />

                    {/* Divider */}
                    <div className="h-px bg-gray-100"></div>

                    {/* SEO + Config */}
                    <SEOConfig />

                    {/* Divider */}
                    <div className="h-px bg-gray-100"></div>

                    {/* Author */}
                    {author && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author</h4>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center overflow-hidden shrink-0">
                                    {author.profileImage?.secure_url ? (
                                        <img src={author.profileImage.secure_url} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <span className="text-white font-bold text-sm">{author.name?.[0]?.toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{author.name}</p>
                                    <p className="text-[11px] text-gray-400 font-medium truncate">{author.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostForm;
