import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthProtectedRoute = ({ allowedRoles }) => {
    const { userInfo } = useSelector((state) => state.auth);

    const token = localStorage.getItem("userToken");

    if (!token || !userInfo) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userInfo.role)) {
        // Permission nabhaeko page ma gaye aafno role ko home ma pathaune
        return <Navigate to={userInfo.role === "admin" ? "/admin" : "/"} replace />;
    }

    return <Outlet />;
};

export default AuthProtectedRoute;