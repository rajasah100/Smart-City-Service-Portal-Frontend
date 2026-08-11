import { FaImage } from "react-icons/fa"


const ComplaintImages = ({ images}) => {
  return (
    <div className="bg-white rounded-xl shadow border mt-2">
        <div className="border-b px-6 py-4">
            <h2 className="font-bold text-lg">
                Compalint Images
            </h2>
        </div>

        <div className="p-6">
            {images?.length === 0 ? (
                <div className="text-gray-500 flex items-center gap-3">
                    <FaImage />
                    No Images Uploaded
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    {images.map((img) => (
                        <img
                        key={img._id || img.publicId}
                        src={img.url}
                        alt=""
                        className="rounded-xl h-44 w-full object-cover border"
                        />
                    ))}
                </div>
            )}
        </div>
     
    </div>
  )
}

export default ComplaintImages
