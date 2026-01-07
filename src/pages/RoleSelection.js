import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RoleSelection.css";

import touristImg from "../assets/touristrole.jpg";
import riderImg from "../assets/riderrole.jpg";
import hotelImg from "../assets/hotelrole.jpg";

function RoleSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const assignRole = async (role) => {
    setLoading(true);
    setError("");

    try {
const res = await fetch(
  "http://localhost:8085/api/auth/onboarding/role",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  }
);

if (!res.ok) {
  const text = await res.text();
  throw new Error(text);
}

const data = await res.json();

// 🔥 STORE UPDATED TOKEN
localStorage.setItem("token", data.token);


      // ✅ Redirect based on role
      if (role === "TOURIST") {
        navigate("/tourist-setup");
      } else if (role === "RIDER") {
        navigate("/dashboard/rider"); // placeholder for now
      } else if (role === "HOTEL") {
        navigate("/dashboard/hotel"); // placeholder for now
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-page">
      <div className="role-card">
        <h2>Register as what choice</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="role-options">

          {/* TOURIST */}
          <div
            className="role-option"
            onClick={() => assignRole("TOURIST")}
          >
            <img src={touristImg} alt="Tourist" />
            <button disabled={loading}>
              Register as a Tourist
            </button>
          </div>

          {/* RIDER */}
          <div
            className="role-option"
            onClick={() => assignRole("RIDER")}
          >
            <img src={riderImg} alt="Rider" />
            <button disabled={loading}>
              Register as a Rider
            </button>
          </div>

          {/* HOTEL */}
          <div
            className="role-option"
            onClick={() => assignRole("HOTEL")}
          >
            <img src={hotelImg} alt="Hotel" />
            <button disabled={loading}>
              Register as a Hotel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
