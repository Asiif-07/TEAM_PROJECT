import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import useBlogStore from '../../../store/useBlogStore';
import { S } from './styles';

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

const RichTextLayout = ({ error }) => {
    const { draft, updateDraft } = useBlogStore();

    return (
        <div>
            <p className={S.label}>
                Article content <span className="text-red-500">*</span>
            </p>
            <div className={`quill-editor-cms ${error ? 'quill-invalid' : ''}`}>
                <ReactQuill
                    theme="snow"
                    value={draft.content}
                    onChange={(val) => updateDraft({ content: val })}
                    modules={MODULES}
                    formats={FORMATS}
                    placeholder="Tell your story. Use headings to structure it and add links or images where they help (at least 20 characters)."
                />
            </div>
            {error && <p role="alert" className={S.error}>{error}</p>}
        </div>
    );
};

export default RichTextLayout;
