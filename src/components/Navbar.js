import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

function AuthNavbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-heading" onClick={() => navigate("/dashboard")}>
        LankaExplore.com
      </div>

      <div className="nav-items">
        <span onClick={() => navigate("/rides")}>Rides</span>
        <span onClick={() => navigate("/hotels")}>Hotels</span>
        <span onClick={() => navigate("/places")}>Places</span>

        {/* ✅ ref must wrap icon + dropdown */}
        <div className="profile-menu" ref={menuRef}>
          <div
            className="profile-icon"
            onClick={() => setShowMenu(prev => !prev)}
          >
            👤
          </div>

          {showMenu && (
            <div className="profile-dropdown">
              <div onClick={() => navigate("/profile")}>Profile</div>
              <div onClick={() => navigate("/bookings")}>Bookings</div>
              <hr />
              <div className="logout" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
