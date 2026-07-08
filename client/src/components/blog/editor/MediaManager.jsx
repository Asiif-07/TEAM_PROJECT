import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X, Star } from 'lucide-react';
import useBlogStore from '../../../store/useBlogStore';

const MediaManager = () => {
    const { draft, updateDraft } = useBlogStore();

    const onDrop = useCallback((acceptedFiles) => {
        updateDraft({ images: [...draft.images, ...acceptedFiles] });
    }, [draft.images, updateDraft]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    const removeImage = (index) => {
        const newImages = draft.images.filter((_, i) => i !== index);
        let newPrimary = draft.primaryImageIndex;
        if (index === newPrimary) newPrimary = 0;
        else if (index < newPrimary) newPrimary--;
        updateDraft({ images: newImages, primaryImageIndex: Math.min(newPrimary, newImages.length - 1) });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover & Gallery</h4>
                <span className="text-[10px] font-semibold text-gray-400">{draft.images.length} file{draft.images.length !== 1 ? 's' : ''}</span>
            </div>

            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                        ? 'border-violet-400 bg-violet-50/50'
                        : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ImagePlus size={20} className="text-violet-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500">
                        {isDragActive ? 'Drop here!' : 'Click or drag images'}
                    </p>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WebP</p>
                </div>
            </div>

            {draft.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {draft.images.map((file, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200/50">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-center pb-2 gap-1.5">
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateDraft({ primaryImageIndex: i }); }}
                                    className={`p-1.5 rounded-lg text-white transition-all ${draft.primaryImageIndex === i ? 'bg-yellow-500' : 'bg-white/20 hover:bg-white/40'}`}
                                >
                                    <Star size={12} fill={draft.primaryImageIndex === i ? 'currentColor' : 'none'} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                    className="p-1.5 bg-white/20 text-white hover:bg-red-500 rounded-lg transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                            {draft.primaryImageIndex === i && (
                                <div className="absolute top-1.5 left-1.5 bg-yellow-500 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md">
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

export default MediaManager;
