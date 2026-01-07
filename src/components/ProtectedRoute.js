import { Navigate } from "react-router-dom";

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ No token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Token exists but expired / broken
  if (!isTokenValid(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // ✅ Token valid
  return children;
};

export default ProtectedRoute;
