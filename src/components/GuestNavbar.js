// components/GuestNavbar.jsx
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function GuestNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-heading" onClick={() => navigate("/")}>
        LankaExplore.com
      </div>

      <div className="nav-items">
        <span onClick={() => navigate("/rides")}>Rides</span>
        <span onClick={() => navigate("/hotels")}>Hotels</span>
        <span onClick={() => navigate("/places")}>Places</span>

        <button
          className="nav-login-btn"
          onClick={() => navigate("/login")}
        >
          Login / Signup
        </button>
      </div>
    </nav>
  );
}

export default GuestNavbar;
