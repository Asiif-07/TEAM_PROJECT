import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X, Images, Upload } from 'lucide-react';
import useBlogStore from '../../../store/useBlogStore';
import { S } from './styles';

// One object URL per File (created once, not on every render).
const FileImage = ({ file, className, alt = '' }) => {
    const url = useMemo(() => URL.createObjectURL(file), [file]);
    return <img src={url} className={className} alt={alt} />;
};

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
        <div className="space-y-6">
            {/* COVER */}
            <div>
                <p className={S.label}><Upload size={15} className="text-blue-600" /> Cover image</p>
                {coverImage ? (
                    <div className="group relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:aspect-[21/9]">
                        <FileImage file={coverImage} alt="Cover" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 transition group-hover:opacity-100" />
                        <button
                            type="button"
                            onClick={removeCover}
                            aria-label="Remove cover image"
                            className="absolute right-3 top-3 rounded-lg bg-white/95 p-2 text-slate-600 shadow-sm transition hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                        <span className="absolute bottom-3 left-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white sm:opacity-0 sm:group-hover:opacity-100">
                            Cover
                        </span>
                    </div>
                ) : (
                    <div {...coverDrop.getRootProps()} className={S.coverZone}>
                        <input {...coverDrop.getInputProps()} aria-label="Upload cover image" />
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Upload size={22} />
                        </span>
                        <p className="text-sm font-semibold text-slate-800">Click to upload or drag an image here</p>
                        <p className="text-xs text-slate-500">PNG, JPG or WebP. Shown at the top of your article.</p>
                    </div>
                )}
            </div>

            {/* GALLERY */}
            <div>
                <p className={`${S.label} justify-between`}>
                    <span className="flex items-center gap-2"><Images size={15} className="text-blue-600" /> Gallery <span className="font-normal text-slate-400">(optional)</span></span>
                    <span className="text-xs font-normal text-slate-400">{galleryImages.length} {galleryImages.length === 1 ? 'image' : 'images'}</span>
                </p>
                {galleryImages.length > 0 && (
                    <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {galleryImages.map((file, i) => (
                            <div key={`${file.name}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                <FileImage file={file} className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeGallery(i)}
                                    aria-label="Remove gallery image"
                                    className="absolute right-1.5 top-1.5 rounded-lg bg-white/95 p-1.5 text-red-500 shadow-sm transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div {...galleryDrop.getRootProps()} className={`${S.galleryZone} ${!hasCover ? 'cursor-not-allowed opacity-50' : ''}`}>
                    <input {...galleryDrop.getInputProps()} aria-label="Upload gallery images" />
                    <ImagePlus size={18} className="text-slate-400" />
                    <p className="text-xs font-medium text-slate-500">{hasCover ? 'Add more images' : 'Add a cover image first'}</p>
                </div>
            </div>
        </div>
    );
};

export default GoogleMediaVault;
