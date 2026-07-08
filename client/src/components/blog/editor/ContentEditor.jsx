import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import useBlogStore from '../../../store/useBlogStore';

const ContentEditor = () => {
    const { draft, updateDraft } = useBlogStore();

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'blockquote', 'code-block', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="quill-editor-cms">
            <ReactQuill
                theme="snow"
                value={draft.content}
                onChange={(val) => updateDraft({ content: val })}
                modules={modules}
                placeholder="Pour your thoughts here... Use the toolbar above to format your content."
                className="min-h-[500px]"
            />
        </div>
    );
};

export default ContentEditor;
