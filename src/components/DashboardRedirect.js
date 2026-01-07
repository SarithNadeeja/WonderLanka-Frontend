import { Navigate } from "react-router-dom";

const DashboardRedirect = () => {
  const token = localStorage.getItem("token");

  // No token → not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (role === "TOURIST") {
      return <Navigate to="/dashboard/tourist" replace />;
    }

    if (role === "RIDER") {
      return <Navigate to="/dashboard/rider" replace />;
    }

    if (role === "HOTEL") {
      return <Navigate to="/dashboard/hotel" replace />;
    }

    // Role missing → onboarding incomplete
    return <Navigate to="/role-selection" replace />;

  } catch (err) {
    // Invalid / expired token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;
