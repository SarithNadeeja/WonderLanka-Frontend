import { NavLink } from "react-router-dom";

function ProfileSidebar() {
  return (
    <div className="profile-tabs">
      <NavLink
        to="/rider/profile/driver"
        className={({ isActive }) =>
          isActive ? "tab active" : "tab"
        }
      >
        Rider Detail
      </NavLink>

      <NavLink
        to="/rider/profile/vehicle"
        className={({ isActive }) =>
          isActive ? "tab active" : "tab"
        }
      >
        Vehicle Detail
      </NavLink>
    </div>
  );
}

export default ProfileSidebar;
