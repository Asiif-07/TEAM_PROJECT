import React from 'react';
import DesignHeader from './DesignHeader';
import GoogleMediaVault from './GoogleMediaVault';
import RichTextLayout from './RichTextLayout';
import SidebarPanels from './SidebarPanels';
import { S } from './styles';

/** Stateless wrapper — zero local state. `fieldErrors` = { title, content, category } */
const PostDesigner = ({ fieldErrors = {} }) => (
    <div className={S.canvas}>
        {/* LEFT: writing area */}
        <div className={S.editorCol}>
            <div className={S.glassCard}>
                <DesignHeader error={fieldErrors.title} />

                <div className="mt-8">
                    <GoogleMediaVault />
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                    <RichTextLayout error={fieldErrors.content} />
                </div>
            </div>
        </div>

        {/* RIGHT: settings */}
        <div className={S.sidebarCol}>
            <SidebarPanels categoryError={fieldErrors.category} />
        </div>
    </div>
);

export default PostDesigner;
