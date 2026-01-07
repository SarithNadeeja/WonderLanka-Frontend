import "./TouristDashboard.css";
import heroImage from "../assets/ellatrain.jpg";
import { useNavigate } from "react-router-dom";

function TouristDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* HERO */}
      <div
        className="dashboard-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="dashboard-overlay">
          <h1>Welcome to LankaExplore</h1>
          <p>Your all-in-one travel companion for Sri Lanka</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="dashboard-actions">
        <div className="action-card" onClick={() => navigate("/rides")}>
          🚗 Book a Ride
        </div>

        <div className="action-card" onClick={() => navigate("/hotels")}>
          🏨 Book a Hotel
        </div>

        <div className="action-card" onClick={() => navigate("/nearby")}>
          📍 What’s Nearby
        </div>

        <div className="action-card" onClick={() => navigate("/profile")}>
          👤 My Profile
        </div>
      </div>
    </div>
  );
}

export default TouristDashboard;
