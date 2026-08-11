import { Navigate, Outlet } from "react-router-dom";

const DepartmentPublicRoute = () => {
  const token = localStorage.getItem("departmentToken");

  return token
    ? <Navigate to="/department" replace />
    : <Outlet />;
};

export default DepartmentPublicRoute;