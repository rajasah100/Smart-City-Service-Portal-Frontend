import { MdEmergency } from "react-icons/md";
import { FaMapMarkedAlt, FaPhoneAlt, FaSearch } from "react-icons/fa";
import { IoIosRadio } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import {
    getEmergencyServices,
    getNearbyServices,
} from "../../../redux/slices/emergencyServiceSlice";

import LoadingSpinner from "../../common/LoadingSpinner";


const HeroSection = () => {

    const dispatch = useDispatch();

    const [search, setSearch] = useState("");

    const {
        services,
        nearbyServices,
        loading
    } = useSelector(
        (state) => state.emergencyService
    );


    const handleSearch = () => {

        if (!search.trim()) return;

        dispatch(
            getEmergencyServices({
                search: search.trim()
            })
        );

    };


    const handleNearby = () => {

        if (!navigator.geolocation) {
            alert("Location is not supported");
            return;
        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;


                dispatch(
                    getNearbyServices({
                        lat,
                        lng,
                        distance: 5000
                    })
                );

            },


            () => {
                alert(
                    "Please allow location permission"
                );
            }

        );

    };



    return (

        <>

            <section className="bg-linear-to-r from-[#25292C] via-[#27292a] to-red-700 text-white">


                <div className="max-w-7xl mx-auto px-8 py-20">


                    <div className="grid lg:grid-cols-2 gap-12 items-center">


                        {/* LEFT */}

                        <div>


                            <div className="
        inline-flex items-center gap-2
        bg-white/20 backdrop-blur-md
        px-4 py-2 rounded-full
        text-sm font-medium mb-6
        ">

                                <MdEmergency className="text-xl animate-pulse" />

                                Emergency Services • 24/7 Available

                            </div>



                            <h1 className="
        text-4xl md:text-6xl
        font-bold leading-tight
        ">

                                Emergency

                                <span className="block text-yellow-300">

                                    Response Center

                                </span>

                            </h1>



                            <p className="
        mt-6 text-lg text-red-100
        max-w-xl leading-8
        ">

                                Get immediate assistance during emergencies.
                                Quickly contact police, ambulance,
                                fire brigade, hospitals and municipality
                                emergency departments anytime.

                            </p>




                            {/* SEARCH */}

                            <div className="relative mt-8 max-w-xl  border rounded-xl">


                                <FaSearch
                                    onClick={handleSearch}
                                    className="
        absolute left-5 top-1/2
        -translate-y-1/2
        text-gray-400 cursor-pointer
        "
                                />


                                <input

                                    type="text"

                                    value={search}

                                    onChange={(e) => setSearch(e.target.value)}

                                    onKeyDown={(e) => {

                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }

                                    }}

                                    placeholder="Search emergency service..."

                                    className="
        w-full rounded-xl py-4
        pl-14 pr-5
        text-white
        outline-none shadow-xl
        "

                                />


                            </div>



                            {/* BUTTONS */}


                            <div className="
        flex flex-wrap gap-4 mt-8
        ">


                                <a

                                    href="tel:100"

                                    className="
        flex gap-2 items-center
        bg-white text-red-600
        px-6 py-4 rounded-xl
        font-semibold
        hover:bg-green-100
        "

                                >

                                    <FaPhoneAlt />

                                    Call Emergency

                                </a>



                                <button

                                    onClick={handleNearby}

                                    className="
        flex items-center gap-2
        border border-white
        px-6 py-4 rounded-xl
        hover:bg-white
        hover:text-red-600
        "

                                >

                                    <FaMapMarkedAlt />

                                    Find Nearby

                                </button>


                            </div>



                        </div>




                        {/* RIGHT CARD */}

                        <div className="flex justify-center lg:justify-end">


                            <div className="
        bg-white rounded-3xl
        shadow-2xl p-8
        w-full max-w-sm
        text-gray-800
        ">


                                <div className="text-center">


                                    <div className="
        w-20 h-20
        rounded-full
        bg-red-100
        flex items-center
        justify-center mx-auto
        animate-pulse
        ">

                                        <MdEmergency
                                            className="text-red-600 text-5xl"
                                        />

                                    </div>


                                    <h2 className="text-3xl font-bold mt-5">

                                        Emergency

                                    </h2>


                                    <p className="text-gray-500 mt-2">

                                        Important Hotline Numbers

                                    </p>


                                </div>



                                <div className="space-y-4 mt-8">


                                    {
                                        [
                                            {
                                                name: "🚓 Nepal Police",
                                                phone: "100"
                                            },

                                            {
                                                name: "🚒 Fire Brigade",
                                                phone: "101"
                                            },

                                            {
                                                name: "🚑 Ambulance",
                                                phone: "102"
                                            }

                                        ].map((item, index) => (

                                            <div
                                                key={index}
                                                className="
        flex justify-between
        bg-blue-50
        rounded-xl p-4
        "
                                            >

                                                <span>
                                                    {item.name}
                                                </span>


                                                <a
                                                    href={`tel:${item.phone}`}
                                                    className="font-bold text-blue-600 underline"
                                                >

                                                    {item.phone}

                                                </a>


                                            </div>


                                        ))
                                    }


                                </div>



                                <a
                                    href="tel:100"
                                    className="
        mt-8 flex
        items-center justify-center
        gap-2 bg-red-600
        text-white py-4 rounded-xl
        "
                                >

                                    <FaPhoneAlt />

                                    Emergency Call

                                </a>



                            </div>


                        </div>


                    </div>



                    {/* SEARCH RESULT */}

                    {
                        (services.length > 0 || nearbyServices.length > 0) &&

                        <div className="
        mt-10 bg-white
        text-gray-800
        rounded-xl p-6
        ">


                            <h2 className="text-2xl font-bold mb-4">

                                Emergency Services

                            </h2>


                            {
                                loading ?

                                    <LoadingSpinner />

                                    :

                                    [
                                        ...services,
                                        ...nearbyServices
                                    ].map(service => (


                                        <div
                                            key={service._id}
                                            className="
        border-b py-4
        "
                                        >

                                            <h3 className="font-bold text-lg">

                                                {service.name}

                                            </h3>


                                            <p>
                                                Type: {service.type}
                                            </p>


                                            <p>
                                                Phone:
                                                <a
                                                    href={`tel:${service.phone}`}
                                                    className="text-blue-600 ml-2"
                                                >
                                                    {service.phone}
                                                </a>
                                            </p>


                                            <p>
                                                Address: {service.address}
                                            </p>


                                        </div>


                                    ))

                            }


                        </div>

                    }



                </div>


            </section>





            {/* LIVE ALERT */}


            <section className="bg-slate-900 text-white">

                <div className="
        max-w-7xl mx-auto
        px-8 py-3
        flex flex-wrap gap-4
        items-center
        ">


                    <span className="
        font-semibold text-yellow-400
        flex items-center gap-2
        ">

                        <IoIosRadio className="animate-pulse" />

                        Live Alerts

                    </span>



                    {
                        [
                            "Heavy Rain Warning",
                            "Power Outage",
                            "Water Supply Interrupted"

                        ].map((alert, index) => (


                            <span
                                key={index}
                                className="bg-yellow-500/20 text-yellow-300 px-4 py-1 rounded-full text-sm"
                            >

                                ● {alert}

                            </span>


                        ))
                    }

                </div>

            </section>


        </>

    );
};


export default HeroSection;