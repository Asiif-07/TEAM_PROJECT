import React from 'react';
import DesignHeader from './DesignHeader';
import GoogleMediaVault from './GoogleMediaVault';
import RichTextLayout from './RichTextLayout';
import SidebarPanels from './SidebarPanels';
import { S } from './styles';

/** Stateless wrapper — zero local state */
const PostDesigner = ({ validationErrors }) => (
    <div className={S.canvas}>
        {/* LEFT: Editor in Glass Card (matches CVBuilder Paper) */}
        <div className={S.editorCol}>
            <div className={S.glassCard}>
                <DesignHeader />

                <div className="mt-8">
                    <GoogleMediaVault />
                </div>

                <div className="mt-8 pt-6 border-t border-black/5">
                    <RichTextLayout />
                </div>

                {validationErrors?.length > 0 && (
                    <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 space-y-1.5">
                        {validationErrors.map((err, i) => (
                            <p key={i} className="text-xs font-bold text-red-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />{err}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT: Sidebar Cards */}
        <div className={S.sidebarCol}>
            <SidebarPanels />
        </div>
    </div>
);

export default PostDesigner;
