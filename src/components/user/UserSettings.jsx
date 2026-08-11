import { useState } from "react";
import { FaUser, FaLock, FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, changePassword } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";

const UserSettings = () => {
    const dispatch = useDispatch();

    const [imageFile, setImageFile] = useState(null);

    const { userInfo, loading } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("profile");

    const [profile, setProfile] = useState({
        name: userInfo?.name || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
        avatar: userInfo?.avatar || "",
    });

    const [preview, setPreview] = useState(userInfo?.avatar || "");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);

            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    const handleProfileChange = async () => {
        const formData = new FormData();

        formData.append("name", profile.name);
        formData.append("phone", profile.phone);

        if (imageFile) {
            formData.append("avatar", imageFile);
        }

        try {
            await dispatch(updateProfile(formData)).unwrap();

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error?.message || "Profile update failed");
        }
    };


    const handlePasswordChange = async () => {

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {
            toast.error("All password fields are required");
            return;
        }


        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }


        try {

            await dispatch(
                changePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword,
                })
            ).unwrap();


            toast.success("Password changed successfully");


            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });


        } catch (error) {

            toast.error(
                error?.message || "Password change failed"
            );

        }

    };



    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
            {/* Header */}
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Profile Settings
            </h2>

            {/* Tabs */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg ${activeTab === "profile"
                        ? "bg-[#4a6c8f] text-white"
                        : "bg-slate-100 text-slate-600"
                        }`}
                >
                    <FaUser />
                    Profile
                </button>

                <button
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg ${activeTab === "security"
                        ? "bg-[#4a6c8f] text-white"
                        : "bg-slate-100 text-slate-600"
                        }`}
                >
                    <FaLock />
                    Security
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div>
                    {/* Image */}
                    <div className="flex items-center gap-5 mb-6">
                        {preview ? (
                            <img
                                src={preview}
                                className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-3xl font-bold">
                                {userInfo?.name?.charAt(0)}
                            </div>
                        )}

                        <label className="cursor-pointer flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                            <FaCamera />
                            Change Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {/* Form */}

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-600">Full Name</label>

                            <input
                                value={profile.name}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-4 py-3 mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Email</label>

                            <input
                                value={profile.email}
                                readOnly
                                className="w-full border rounded-lg px-4 py-3 mt-1 bg-slate-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Phone Number</label>

                            <input
                                value={profile.phone}
                                onChange={(e) =>
                                    setProfile({
                                        ...profile,
                                        phone: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-4 py-3 mt-1"
                            />
                        </div>

                        <button
                            onClick={handleProfileChange}
                            disabled={loading}
                            className={`px-6 py-3 rounded-lg text-white flex items-center gap-2 ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#4a6c8f]"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Security Tab */}

            {activeTab === "security" && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Change Password</h3>

                    <input
                        type="password"
                        placeholder="Current Password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({
                            ...passwordData, currentPassword: e.target.value
                        })}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({
                            ...passwordData, newPassword: e.target.value
                        })}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({
                            ...passwordData, confirmPassword: e.target.value
                        })}
                        className="w-full border rounded-lg px-4 py-3"
                    />

                    <button
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg text-white flex items-center gap-2 ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#4a6c8f]"
                            }`}
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Saving...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserSettings;
