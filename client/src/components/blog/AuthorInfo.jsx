import React, { useMemo } from 'react';
import { User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const normalizeUrl = (value) => {
    const v = (value || '').trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    // Allow users to paste domains like `github.com/name`
    if (/^[\w.-]+\.[a-z]{2,}([\/].*)?$/i.test(v)) return `https://${v}`;
    return v;
};

const AuthorInfo = ({ author }) => {
    if (!author) return null;

    const displayName = author.blogProfile?.displayName || author.name;
    const bio = author.blogProfile?.bio || "Career expert and contributor at CareerForge. Passionate about helping professionals land their dream jobs through expert guidance and better designs.";
    const avatar = author.blogProfile?.avatar?.secure_url || author.profileImage?.secure_url;

    const social = useMemo(() => {
        const github = normalizeUrl(author.blogProfile?.socialLinks?.github);
        const linkedin = normalizeUrl(author.blogProfile?.socialLinks?.linkedin);
        const website = normalizeUrl(author.blogProfile?.socialLinks?.website);
        return { github, linkedin, website };
    }, [author]);

    const initials = useMemo(() => {
        const n = (displayName || '').trim();
        if (!n) return '';
        const parts = n.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || '';
        const second = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
        return (first + second).toUpperCase();
    }, [displayName]);

    return (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left transition-all hover:border-blue-100">
            <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center border border-blue-100 overflow-hidden shrink-0 shadow-lg shadow-blue-100/20">
                {avatar ? (
                    <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                    <UserIcon className="text-blue-500" size={32} />
                )}
            </div>
            <div className="space-y-4 flex-grow">
                <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">{displayName}</h4>
                        <span className="inline-block w-fit px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-sm">
                            Author
                        </span>
                    </div>
                </div>
                <p className="text-gray-500 leading-relaxed font-medium text-base max-w-2xl">
                    {bio}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-6 pt-2 items-center">
                    <Link to={`/author/${author._id}`} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-all flex items-center gap-1 group">
                        Explore Profile
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                    <Link to={`/blogs?author=${author._id}`} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all">
                        All Articles
                    </Link>

                    {(social.github || social.linkedin || social.website) && (
                        <div className="h-4 w-[1px] bg-gray-100 hidden sm:block"></div>
                    )}

                    <div className="flex flex-wrap gap-2 sm:gap-4">
                        {social.github && (
                            <a
                                href={social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-blue-50 transition-colors"
                                aria-label="GitHub"
                            >
                                <i className="fab fa-github" />
                            </a>
                        )}
                        {social.linkedin && (
                            <a
                                href={social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-[#0077b5] hover:bg-blue-50 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <i className="fab fa-linkedin" />
                            </a>
                        )}
                        {social.website && (
                            <a
                                href={social.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-blue-50 transition-colors"
                                aria-label="Website"
                            >
                                <span className="text-[11px] font-black">WWW</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorInfo;
