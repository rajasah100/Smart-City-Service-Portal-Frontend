import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const DepartmentProtectedRoute = () => {
    const { department } = useSelector((state) => state.department);

    const token = localStorage.getItem("departmentToken");

    if (!token || !department) {
        return <Navigate to="/department/login" replace />;
    }

    return <Outlet />;
};

export default DepartmentProtectedRoute;