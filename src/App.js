import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";          // Auth navbar
import GuestNavbar from "./components/GuestNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CheckEmail from "./pages/CheckEmail";
import VerifyStatus from "./pages/EmailVerificationStatus";
import RoleSelection from "./pages/RoleSelection";
import TouristSetup from "./pages/TouristSetup";

import DashboardRedirect from "./components/DashboardRedirect";
import TouristDashboard from "./pages/TouristDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import RiderNavbar from "./components/RiderNavbar";

import  RiderProfile from "./pages/rider/RiderProfile";
import DriverDetails from "./pages/rider/DriverDetails";
import VehicleDetails from "./pages/rider/VehicleDetails";


/* ---------------- APP LAYOUT ---------------- */

function AppLayout() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Routes that should NEVER show any navbar
  const hideNavbarRoutes = [
    "/signup",
    "/login",
    "/verify-email",
    "/check-email",
    "/role-selection",
    "/tourist-setup",
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* NAVBAR LOGIC */}
      {!hideNavbar && token && isDashboardRoute && (() => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const role = payload.role;

          if (role === "RIDER") return <RiderNavbar />;
          return <Navbar />; // Tourist navbar
        } catch {
          return <GuestNavbar />;
        }
      })()}

{!hideNavbar && !token && <GuestNavbar />}


      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email" element={<VerifyStatus />} />
        <Route path="/rider/profile" element={<RiderProfile />} />
        <Route path="/rider/profile/driver" element={<DriverDetails />} />
        <Route path="/rider/profile/vehicle" element={<VehicleDetails />} />


        {/* ONBOARDING (AUTH REQUIRED) */}
        <Route
          path="/role-selection"
          element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tourist-setup"
          element={
            <ProtectedRoute>
              <TouristSetup />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD ROOT */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARDS */}
        <Route
          path="/dashboard/tourist"
          element={
            <ProtectedRoute>
              <TouristDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/rider"
          element={
            <ProtectedRoute>
              <RiderDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

/* ---------------- APP ROOT ---------------- */

function App() {

  // 🔐 GLOBAL TOKEN CLEANUP (CRITICAL)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
