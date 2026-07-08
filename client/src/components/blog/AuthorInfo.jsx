import React from 'react';
import { User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthorInfo = ({ author }) => {
    if (!author) return null;

    const displayName = author.blogProfile?.displayName || author.name;
    const bio = author.blogProfile?.bio || "Career expert and contributor at CareerForge. Passionate about helping professionals land their dream jobs through expert guidance and better designs.";
    const avatar = author.blogProfile?.avatar?.secure_url || author.profileImage?.secure_url;

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

                    {(author.blogProfile?.socialLinks?.github || author.blogProfile?.socialLinks?.linkedin || author.blogProfile?.socialLinks?.website) && (
                        <div className="h-4 w-[1px] bg-gray-100 hidden sm:block"></div>
                    )}

                    <div className="flex gap-4">
                        {author.blogProfile?.socialLinks?.github && (
                            <a href={author.blogProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                                <i className="fab fa-github"></i>
                            </a>
                        )}
                        {author.blogProfile?.socialLinks?.linkedin && (
                            <a href={author.blogProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors">
                                <i className="fab fa-linkedin"></i>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorInfo;
