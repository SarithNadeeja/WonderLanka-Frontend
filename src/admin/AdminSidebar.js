import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo / Title */}
      <div className="sidebar-logo">
        Admin Panel
      </div>

      {/* Dashboard */}
      <nav className="sidebar-section">
        <NavLink to="/" className="sidebar-link">
          Dashboard
        </NavLink>
      </nav>

      {/* Verifications */}
      <div className="sidebar-section">
        <p className="sidebar-title">Verifications</p>

        <NavLink
          to="/verifications/driving-license"
          className="sidebar-link"
        >
          Driving License
        </NavLink>

        <NavLink
          to="/verifications/insurance"
          className="sidebar-link"
        >
          Insurance
        </NavLink>
      </div>

      {/* Admin Control Panel */}
      <div className="sidebar-section">
        <p className="sidebar-title">Admin Control Panel</p>

        <NavLink
          to="/admin-control"
          className="sidebar-link"
        >
          Add / Remove Admin
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
