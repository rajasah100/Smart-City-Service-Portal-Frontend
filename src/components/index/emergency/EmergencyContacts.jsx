import { useEffect } from "react";
import { FaBolt, FaGripfire, FaPhoneAlt, FaTint } from "react-icons/fa";
import { MdLocalHospital, MdLocalPolice } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../../redux/slices/departmentSlice";
import LoadingSpinner from "../../common/LoadingSpinner";


const EmergencyContacts = () => {
    const dispatch = useDispatch();

    const {
        departments = [],
        loading
    } = useSelector((state) => state.department);

    useEffect(() => {
        dispatch(getDepartments());
    }, [dispatch]);

    const contacts = [
        {
            id: 1,
            title: "Nepal Police",
            number: "100",
            icon: <MdLocalPolice size={40} />,
            color: "bg-blue-100 text-blue-600",
        },
        {
            id: 2,
            title: "Fire Brigade",
            number: "101",
            icon: <FaGripfire size={40} />,
            color: "bg-red-100 text-red-600",
        },
        {
            id: 3,
            title: "Ambulance",
            number: "102",
            icon: <MdLocalHospital size={40} />,
            color: "bg-green-100 text-green-600",
        },

        ...departments.map((department) => ({
            id: department._id,
            title: department.name,
            number: department.phone,
            icon: department.name.toLowerCase().includes("water") ? (
                <FaTint size={36} />
            ) : (
                <FaBolt size={36} />
            ),
            color: department.name.toLowerCase().includes("water") ? "bg-cyan-100 text-cyan-600" : "bg-yellow-100 text-yellow-600",
        }))
    ];

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-8 ">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Emergency Contacts
                    </h2>

                    <p className="text-gray-500 mt-3 mac-w-2xl mx-auto">
                        Contact the appropriate emergency service immediately during
                        critical situations. These services are available 24/7.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition duration-300 p-6"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${contact.color}`}>
                                {contact.icon}
                            </div>

                            <h3 className="text-xl font-semibold mt-6 text-gray-800">
                                {contact.title}
                            </h3>

                            <p className="text-2xl font-bold text-gray-900 mt-3">
                                {contact.number}
                            </p>

                            <span className="inline-block mt-3 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                24/7 Available
                            </span>

                            <a
                                href={`tel:${contact.number}`}
                                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition"
                            >
                                <FaPhoneAlt />
                                Call Now
                            </a>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default EmergencyContacts
