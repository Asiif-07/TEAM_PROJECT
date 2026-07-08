import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import useBlogStore from '../../../store/useBlogStore';

const MODULES = {
    toolbar: [
        [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }, { align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        ['clean'],
    ],
};

const FORMATS = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'indent', 'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video', 'formula',
    'clean',
];

const RichTextLayout = () => {
    const { draft, updateDraft } = useBlogStore();

    return (
        <div className="quill-editor-cms p-1">
            <ReactQuill
                theme="snow"
                value={draft.content}
                onChange={(val) => updateDraft({ content: val })}
                modules={MODULES}
                formats={FORMATS}
                placeholder="Start writing your next masterpiece..."
                className="min-h-[400px]"
            />
        </div>
    );
};

export default RichTextLayout;
