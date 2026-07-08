import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getBlogProfile, updateBlogProfile } from '../../../api/user';
import { S } from './styles';
import { Camera, Loader2, User, Pencil, Save } from 'lucide-react';

const AuthorSync = () => {
    const { accessToken, refreshAccessToken, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ displayName: "", bio: "" });
    const fileRef = useRef(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getBlogProfile({ accessToken, refreshAccessToken });
                if (res.success) {
                    setProfile(res.data);
                    setForm({ displayName: res.data.displayName || "", bio: res.data.bio || "" });
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        if (accessToken) fetch();
    }, [accessToken, refreshAccessToken]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('displayName', form.displayName);
            fd.append('bio', form.bio);
            const res = await updateBlogProfile({ accessToken, refreshAccessToken, formData: fd });
            if (res.success) { setProfile(res.data); setEditing(false); }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('avatar', file);
            fd.append('displayName', form.displayName);
            fd.append('bio', form.bio);
            const res = await updateBlogProfile({ accessToken, refreshAccessToken, formData: fd });
            if (res.success) setProfile(res.data);
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className={S.card}>
            <div className="flex items-center justify-center py-6"><Loader2 size={20} className="animate-spin text-[#2563EB]" /></div>
        </div>
    );

    const avatarUrl = profile?.avatar?.secure_url || user?.profileImage?.secure_url;
    const initial = (profile?.displayName || user?.name || "U").charAt(0).toUpperCase();

    return (
        <div className={S.card}>
            <div className="flex items-center justify-between mb-3">
                <h4 className={S.cardTitle}><User size={14} className="text-[#2563EB]" /> Author</h4>
                <button onClick={() => editing ? handleSave() : setEditing(true)}
                    disabled={saving}
                    className="text-[11px] text-[#2563EB] font-bold hover:underline flex items-center gap-1">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : editing ? <><Save size={12} />Save</> : <><Pencil size={12} />Edit</>}
                </button>
            </div>

            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative group shrink-0">
                    {avatarUrl ? (
                        <img src={avatarUrl} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#2563EB]/20" alt="" />
                    ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] flex items-center justify-center text-white text-xl font-black">
                            {initial}
                        </div>
                    )}
                    <input type="file" hidden ref={fileRef} accept="image/*" onChange={handleAvatarUpload} />
                    <button onClick={() => fileRef.current.click()}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#111827] text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                        <Camera size={12} />
                    </button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    {editing ? (
                        <div className="space-y-2">
                            <input
                                value={form.displayName}
                                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                placeholder="Display name"
                                className={`${S.input} !py-2 !text-xs`}
                            />
                            <textarea
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                placeholder="Short bio (280 chars)"
                                maxLength={280}
                                rows={2}
                                className={`${S.input} !py-2 !text-xs resize-none`}
                            />
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-bold text-gray-900 truncate">{profile?.displayName || user?.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{profile?.bio || user?.email}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorSync;
