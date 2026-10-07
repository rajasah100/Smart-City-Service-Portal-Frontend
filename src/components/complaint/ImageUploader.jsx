import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaCamera, FaCloudUploadAlt, FaImages, FaTimes } from "react-icons/fa";

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

// Photo: drag-drop, file chhanne wa mobile ma sidhai camera
const ImageUploader = ({ images, updateField }) => {
    const { t } = useTranslation();
    const fileRef = useRef(null);
    const cameraRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const addFiles = (files) => {
        const selected = [...images];

        for (const file of files) {
            if (!TYPES.includes(file.type)) {
                toast.error(t("complaintForm.photos.invalid", { name: file.name }));
                continue;
            }

            if (file.size > MAX_SIZE) {
                toast.error(t("complaintForm.photos.tooLarge", { name: file.name }));
                continue;
            }

            if (selected.some((img) => img.file.name === file.name && img.file.size === file.size)) {
                toast.info(t("complaintForm.photos.duplicate", { name: file.name }));
                continue;
            }

            if (selected.length >= MAX_IMAGES) {
                toast.error(t("complaintForm.photos.max"));
                break;
            }

            selected.push({ id: `${Date.now()}-${Math.random()}`, file, preview: URL.createObjectURL(file) });
        }

        updateField("images", selected);
    };

    const handleInput = (e) => {
        addFiles(Array.from(e.target.files));
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    };

    const removeImage = (id) => {
        const image = images.find((img) => img.id === id);
        if (image) URL.revokeObjectURL(image.preview);
        updateField("images", images.filter((img) => img.id !== id));
    };

    const full = images.length >= MAX_IMAGES;

    return (
        <div className="mt-6">
            <div className="mb-1.5 flex items-end justify-between">
                <p className="text-sm font-semibold text-slate-700">
                    {t("complaintForm.photos.label")} <span className="text-[#dc143c]">*</span>
                </p>
                <span className={`text-xs font-medium ${full ? "text-amber-600" : "text-slate-400"}`}>
                    {t("complaintForm.photos.count", { count: images.length })}
                </span>
            </div>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
                    dragging ? "scale-[1.01] border-[#003893] bg-[#003893]/5" : "border-slate-300 bg-slate-50/60"
                } ${full ? "opacity-60" : ""}`}
            >
                <FaCloudUploadAlt className={`mx-auto text-4xl transition ${dragging ? "text-[#003893]" : "text-slate-400"}`} />
                <p className="mt-2 text-sm font-medium text-slate-700">{t("complaintForm.photos.drop")}</p>
                <p className="my-3 text-xs uppercase tracking-wide text-slate-400">{t("complaintForm.photos.or")}</p>

                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        type="button"
                        disabled={full}
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg bg-[#003893] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#002a6e] disabled:cursor-not-allowed"
                    >
                        <FaImages />
                        {t("complaintForm.photos.choose")}
                    </button>
                    <button
                        type="button"
                        disabled={full}
                        onClick={() => cameraRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg border border-[#003893] bg-white px-4 py-2 text-sm font-semibold text-[#003893] transition hover:bg-[#003893]/5 disabled:cursor-not-allowed"
                    >
                        <FaCamera />
                        {t("complaintForm.photos.camera")}
                    </button>
                </div>

                <p className="mt-3 text-xs text-slate-400">{t("complaintForm.photos.hint")}</p>

                <input ref={fileRef} type="file" multiple accept={TYPES.join(",")} className="hidden" onChange={handleInput} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInput} />
            </div>

            {images.length > 0 && (
                <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {images.map((img) => (
                        <li key={img.id} className="animate-fade-up group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            <img src={img.preview} alt={img.file.name} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(img.id)}
                                aria-label={t("complaintForm.photos.remove")}
                                title={t("complaintForm.photos.remove")}
                                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white transition hover:bg-[#dc143c]"
                            >
                                <FaTimes />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ImageUploader;
