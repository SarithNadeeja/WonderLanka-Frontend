import { useState } from "react";
import RiderNavbar from "../../components/RiderNavbar";
import DriverDetails from "./DriverDetails";
import VehicleDetails from "./VehicleDetails";
import "./RiderProfile.css";

function RiderProfile() {
  const [activeTab, setActiveTab] = useState("DRIVER");

  return (
    <>
      <RiderNavbar />

      <div className="profile-page">
        {/* ===== HEADER BANNER ===== */}
        <div className="profile-banner">
          <h1>My Profile</h1>
        </div>

        {/* ===== TABS ===== */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "DRIVER" ? "active" : ""}`}
            onClick={() => setActiveTab("DRIVER")}
          >
            Rider Detail
          </button>

          <button
            className={`tab ${activeTab === "VEHICLE" ? "active" : ""}`}
            onClick={() => setActiveTab("VEHICLE")}
          >
            Vehicle Detail
          </button>
        </div>

        {/* ===== CONTENT (SAME PAGE) ===== */}
        <div className="profile-content">
          {activeTab === "DRIVER" && <DriverDetails />}
          {activeTab === "VEHICLE" && <VehicleDetails />}
        </div>
      </div>
    </>
  );
}

export default RiderProfile;
