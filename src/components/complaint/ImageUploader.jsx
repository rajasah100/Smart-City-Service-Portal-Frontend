import { useRef, useState } from "react";
import { FaRegImage } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { RiUploadCloudLine } from "react-icons/ri";



const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

const ImageUploader = ({ images, updateField }) => {
    console.log("images:", images);
    console.log("onChange:", updateField);


    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const validateFiles = (files) => {
        let selected = [...images];

        for (const file of files) {
            if (
                ![
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                ].includes(file.type)
            ) {
                alert(`${file.name} is not a valid image.`);
                continue;
            }

            if (file.size > MAX_SIZE) {
                alert(`${file.name} exceeds 5MB.`);
                continue;
            }

            if (selected.length >= MAX_IMAGES) {
                alert("Maximum 5 images allowed.");
                break;
            }

            const exists = selected.some(
                (img) => img.file.name === file.name && img.file.size
            );

            if (exists) {
                continue;
            }

            selected.push({
                id: Date.now() + Math.random(),
                file,
                preview: URL.createObjectURL(file),
            });
        }

        updateField("images", selected);
    };

    const handleChange = (e) => {
        validateFiles(Array.from(e.target.files));

        e.target.value = "";
    };

    const removeImage = (id) => {
        const image = images.find((img) => img.id === id);

        if (image) {
            URL.revokeObjectURL(image.preview)
        }

        const updated = images.filter((img) => img.id !== id);

        updateField("images", updated);
    }

    const handleDrop = (e) => {
        e.preventDefault();

        setDragging(false);

        validateFiles(Array.from(e.dataTransfer.files))

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }


    return (
        <div className="mt-8">
            <label className="block font-semibold text-gray-700 mb-3">
                Upload Photos
            </label>

            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragging ? "border-[#0f4c81] bg-blue-50" : "border-gray-300 hover:border-[#0f5c81]"}`}
            >
                <RiUploadCloudLine size={45} className="mx-auto text-[#0f4c81]" />
                <h3 className="mt-4 text-lg font-semibold">Drag & Drop Images</h3>
                <p className="text-xs text-gray-400 mt-2">
                    JPG, PNG, WEBP • Max 5 Images • 5MB each
                </p>

                <input
                    type="file"
                    ref={inputRef}
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleChange}
                />
            </div>

            {/* preview */}
            {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="relative rounded-xl overflow-hidden border">
                            <img
                                src={img.preview}
                                alt={img.file.name}
                                className="w-full h-36 object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => removeImage(img.id)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            >
                                <FiTrash size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 flex text-center gap-3 text-gray-400">
                    <FaRegImage size={20} />
                    <span>No images selected.</span>
                </div>
            )}
        </div>
    )
}

export default ImageUploader
