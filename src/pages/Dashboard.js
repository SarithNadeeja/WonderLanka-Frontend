import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  const payload = JSON.parse(atob(token.split(".")[1]));

  if (payload.role === "TOURIST") {
    return <Navigate to="/dashboard/tourist" replace />;
  }

    if (payload.role === "RIDER") {
    return <Navigate to="/dashboard/rider" replace />;
    }

    if (payload.role === "HOTEL") {
    return <Navigate to="/dashboard/hotel" replace />;
    }

  return <Navigate to="/" replace />;
};

export default Dashboard;
