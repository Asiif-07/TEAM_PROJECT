import React, { useState } from 'react';
import { Image as ImageIcon, X, UploadCloud, GripVertical } from 'lucide-react';

const MediaUpload = ({ onImagesChange }) => {
    const [previews, setPreviews] = useState([]);
    const [dragging, setDragging] = useState(false);

    const handleFiles = (files) => {
        const fileArray = Array.from(files);
        const newPreviews = fileArray.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            file
        }));

        const updated = [...previews, ...newPreviews];
        setPreviews(updated);
        onImagesChange(updated.map(p => p.file));
    };

    const removeImage = (id) => {
        const updated = previews.filter(p => p.id !== id);
        setPreviews(updated);
        onImagesChange(updated.map(p => p.file));
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-gray-900 block">Cover & Body Images</label>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-3xl p-10 transition-all text-center space-y-4 ${dragging ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-400"
                    }`}
            >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <UploadCloud size={32} />
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-900">Drag & drop images here</p>
                    <p className="text-sm text-gray-400 font-medium">PNG, JPG or WEBP (Max 5MB each)</p>
                </div>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    id="blog-images"
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <label
                    htmlFor="blog-images"
                    className="inline-flex px-8 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 shadow-sm hover:shadow-md cursor-pointer transition-all"
                >
                    Browse Files
                </label>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {previews.map((img, index) => (
                        <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={img.url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="p-2 bg-white text-gray-900 rounded-lg hover:text-blue-600 transition-colors">
                                    <GripVertical size={16} />
                                </button>
                                <button
                                    onClick={() => removeImage(img.id)}
                                    className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                                    Cover
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaUpload;
