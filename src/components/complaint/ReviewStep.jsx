import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaUser, FaPhone, FaFolderOpen } from "react-icons/fa"
import { IoMdMail } from "react-icons/io";
import { AiFillFileText } from "react-icons/ai";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";

const ReviewItem = ({ icon: Icon, label, value }) => (
    <div className="border-b last:border-b-0 py-4">
        <div className="flex items-start gap-3">
            <Icon className="text-[#0f4c81] mt-1" size={18} />

            <div className="flex-1">
                <p>
                    {label}
                </p>

                <p>
                    {value || "-"}
                </p>
            </div>
        </div>
    </div>
)

const ReviewStep = ({ data }) => {

    const { departments } = useSelector((state) => state.department);

    const selectedDepartment = departments.find(
        (dept) => dept._id === data.department
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Review Complaint
                </h2>
                <p className="text-gray-500 mt-2">
                    Please review all information before submitting.
                </p>
            </div>

            {/* Citizen Information */}
            <div className="bg-white border rounded-xl mb-6">
                <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-lg">
                        Citizen Information
                    </h3>
                </div>

                <div className="px-6">
                    <ReviewItem
                        icon={FaUser}
                        label="Full Name"
                        value={data.fullName}
                    />

                    <ReviewItem
                        icon={FaPhone}
                        label="Mobile Phone"
                        value={data.phone}
                    />

                    <ReviewItem
                        icon={IoMdMail}
                        label="Email"
                        value={data.email || "Not Provided"}
                    />
                </div>
            </div>

            {/* Images */}
            <div className="bg-white border rounded-xl mb-6">
                <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-lg">
                        Uploaded Image
                    </h3>
                </div>

                <div className="p-6">
                    {data.images.length === 0 ? (
                        <div className="flex items-center gap-3 text-gray-500">
                            <FaImage size={18} />
                            No Images Uploaded
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {data.images?.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.preview}
                                    alt={`Complaint ${img.id}`}
                                    className="w-full h-36 object-cover rounded-lg border"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Complaint */}
            <div className="bg-white border rounded-xl mb-6">
                <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-lg">Complaint Information</h3>
                </div>
                <div className="px-6">
                    <ReviewItem
                        icon={FaFolderOpen}
                        label="Department"
                        value={selectedDepartment?.name || "N/A"}
                    />
                    <ReviewItem
                        icon={AiFillFileText}
                        label="Title"
                        value={data.title}
                    />
                    <ReviewItem
                        icon={AiFillFileText}
                        label="Description"
                        value={data.description}
                    />
                    <ReviewItem
                        icon={TbAlertTriangleFilled}
                        label="Priority"
                        value={data.priority}
                    />


                </div>

            </div>


            {/* Complaint Location */}
            <div className="bg-white border rounded-xl mb-6">
                <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-lg">Complaint Location</h3>
                </div>

                <div className="px-6">
                    <ReviewItem
                        icon={FaFolderOpen}
                        label="Province"
                        value={data.province}
                    />
                    <ReviewItem
                        icon={FaFolderOpen}
                        label="Municipality"
                        value={data.municipality}
                    />
                    <ReviewItem
                        icon={FaFolderOpen}
                        label="District"
                        value={data.district}
                    />
                    <ReviewItem
                        icon={FaFolderOpen}
                        label="Ward No."
                        value={data.ward}
                    />
                    <ReviewItem
                        icon={FaFolderOpen}
                        label="Tole / Street"
                        value={data.tole}
                    />
                </div>
            </div>

            {/* Location */}
            <div className="bg-white border rounded-xl mb-6">
                <div className="px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-lg">
                        Location Preview
                    </h3>
                </div>

                <div className="p-6">
                    <MapContainer
                        center={
                            data.latitude && data.longitude ? [
                                Number(data.latitude),
                                Number(data.longitude),
                            ] : [27.7172, 85.324]}
                        zoom={16}
                        scrollWheelZoom={false}
                        className="w-full h-87.5 rounded-xl relative z-0"
                    >
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {data.latitude && data.longitude && (
                            <Marker
                                position={[
                                    Number(data.latitude) || 27.7172,
                                    Number(data.longitude) || 85.324,
                                ]}
                            />
                        )}

                    </MapContainer>
                </div>
            </div>


        </div>
    )
}

export default ReviewStep
