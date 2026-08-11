import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("userToken");

  let user = null;
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo && userInfo !== "undefined") {
    try {
      user = JSON.parse(userInfo);
    } catch (err) {
      console.error("Invalid userInfo in localStorage:", err);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
    }
  }

  if (token && user) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "department":
        return <Navigate to="/department" replace />;
      default:
        return <Navigate to="/user" replace />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;