import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X, Images, Upload } from 'lucide-react';
import useBlogStore from '../../../store/useBlogStore';
import { S } from './styles';

const GoogleMediaVault = () => {
    const { draft, updateDraft } = useBlogStore();

    const onDropCover = useCallback((files) => {
        if (files.length > 0) {
            const newImages = [...draft.images];
            newImages[0] = files[0];
            updateDraft({ images: newImages, primaryImageIndex: 0 });
        }
    }, [draft.images, updateDraft]);

    const onDropGallery = useCallback((files) => {
        if (draft.images.length === 0) return;
        updateDraft({ images: [...draft.images, ...files] });
    }, [draft.images, updateDraft]);

    const coverImage = (draft.images.length > 0 && draft.images[0]) ? draft.images[0] : null;
    const hasCover = !!coverImage;
    const coverDrop = useDropzone({ onDrop: onDropCover, accept: { 'image/*': [] }, multiple: false });
    const galleryDrop = useDropzone({ onDrop: onDropGallery, accept: { 'image/*': [] }, multiple: true, disabled: !hasCover });
    const galleryImages = draft.images.slice(1);

    // Remove cover WITHOUT shifting gallery images into cover slot
    const removeCover = () => {
        const newImages = [...draft.images];
        newImages[0] = null; // Keep slot, just clear it
        updateDraft({ images: newImages.filter(Boolean), primaryImageIndex: 0 });
    };
    const removeGallery = (idx) => updateDraft({ images: draft.images.filter((_, i) => i !== idx + 1) });

    return (
        <div className="space-y-8">
            {/* COVER */}
            <div>
                <h4 className={S.cardTitle}><Upload size={14} className="text-[#2563EB]" /> Cover Image</h4>
                {coverImage ? (
                    <div className="relative group rounded-3xl overflow-hidden border border-black/5 aspect-[21/9]">
                        <img src={URL.createObjectURL(coverImage)} className="w-full h-full object-cover" alt="Cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-all" />
                        <button onClick={removeCover}
                            className="absolute top-3 right-3 p-2 bg-white/90 text-gray-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 shadow-sm">
                            <X size={14} />
                        </button>
                        <div className="absolute bottom-3 left-3 bg-[#2563EB] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                            Cover
                        </div>
                    </div>
                ) : (
                    <div {...coverDrop.getRootProps()} className={S.coverZone}>
                        <input {...coverDrop.getInputProps()} />
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <Upload size={24} className="text-[#2563EB]" />
                        </div>
                        <p className="text-sm text-gray-600 font-bold">Add Featured Image</p>
                        <p className="text-xs text-gray-400">This will be your article's hero image</p>
                    </div>
                )}
            </div>

            {/* GALLERY */}
            <div>
                <h4 className={S.cardTitle}><Images size={14} className="text-[#2563EB]" /> Gallery <span className="ml-auto text-[10px] text-gray-400 font-medium normal-case tracking-normal">{galleryImages.length} images</span></h4>
                {galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        {galleryImages.map((file, i) => (
                            <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-black/5">
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <button onClick={() => removeGallery(i)} className="p-2 bg-white/90 text-red-500 rounded-xl hover:bg-white shadow-sm">
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div {...galleryDrop.getRootProps()} className={`${S.galleryZone} ${!hasCover ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input {...galleryDrop.getInputProps()} />
                    <ImagePlus size={18} className="text-gray-400" />
                    <p className="text-[11px] text-gray-400 font-semibold">{hasCover ? 'Add more images' : 'Add cover first'}</p>
                </div>
            </div>
        </div>
    );
};

export default GoogleMediaVault;
