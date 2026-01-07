import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./RiderNavbar.css";

function RiderNavbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const token = localStorage.getItem("token");

  // 🔐 Extract userId from JWT
  let userId = "";
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.sub; // backend sets subject = userId
    }
  } catch {
    userId = "";
  }

  const displayName = userId ? `User${userId}` : "User";
  const verificationStatus = "NOT VERIFIED"; // later from backend

  const initials = displayName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div
        className="nav-heading"
        onClick={() => navigate("/dashboard/rider")}
      >
        LankaExplore.com
      </div>

      <div className="nav-items">
        <span onClick={() => navigate("/dashboard/rider")}>Home</span>
        <span onClick={() => navigate("/control-pannel")}>Dashboard</span>
        <span onClick={() => navigate("/about-us")}>About us</span>
        <span onClick={() => navigate("/rider/profile")}>Profile</span>

        <div className="profile-menu" ref={menuRef}>
          <div
            className="profile-icon"
            onClick={() => setShowMenu(prev => !prev)}
          >
            👤
          </div>

          {showMenu && (
            <div className="profile-dropdown rider-dropdown">
              <div className="profile-header">
                <div className="avatar">{initials}</div>
                <div>
                  <div className="profile-name">{displayName}</div>
                  <div className={`status not-verified`}>
                    {verificationStatus}
                  </div>
                </div>
              </div>

              <hr />

              <div className="logout" onClick={logout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default RiderNavbar;
