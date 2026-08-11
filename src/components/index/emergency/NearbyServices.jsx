import { FaGripfire, FaHospital, FaMapMarkedAlt, FaPhoneAlt } from "react-icons/fa";
import { MdLocalPolice } from "react-icons/md";


const services = [
    {
        id: 1,
        name: "Janakpur Provincial Hospital",
        type: "Hospital",
        address: "Janakpur-08, Dhanusha",
        phone: "041-520133",
        status: "Open 24/7",
        icon: <FaHospital />,
        color: "bg-green-100 text-green-600",
    },
    {
        id: 2,
        name: "Janakpur Police Office",
        type: "Police Station",
        address: "Janakpur-04, Dhanusha",
        phone: "100",
        status: "Open 24/7",
        icon: <MdLocalPolice />,
        color: "bg-blue-100 text-blue-600",
    },
    {
        id: 3,
        name: "Janakpur Fire Brigade",
        type: "Fire Station",
        address: "Janakpur-09, Dhanusha",
        phone: "101",
        status: "Open 24/7",
        icon: <FaGripfire />,
        color: "bg-red-100 text-red-600",
    },
];

const NearbyServices = () => {
    return (
        <section id="nearby-services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8">

                {/* Heading */}
                <div className="text-center mb-12">
                    <span className="text-red-600 font-semibold uppercase">
                        Nearby Services
                    </span>

                    <h2 className="text-4xl font-bold text-gray-800 mt-2">
                        Emergency Service Locations
                    </h2>

                    <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                        Find the nearest emergency service locations with contact
                        information and addresses.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition p-6"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${service.color}`}>
                                {service.icon}
                            </div>

                            <h3 className="text-xl font-semibold text-gray-800 mt-5">
                                {service.name}
                            </h3>

                            <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                                {service.type}
                            </span>

                            <div className="mt-5 space-y-3 text-gray-600">

                                <div className="flex items-start gap-3">
                                    <FaMapMarkedAlt className="mt-1 text-red-500" />
                                    <span>
                                        {service.address}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaPhoneAlt className="text-green-600" />
                                    <span>
                                        {service.phone}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5">
                                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                    {service.status}
                                </span>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <a
                                    href={`tel:${service.phone}`}
                                    className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
                                >
                                    Call
                                </a>

                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${service.lat},${service.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-3 rounded-xl transition text-center"
                                >
                                    Navigate
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default NearbyServices
