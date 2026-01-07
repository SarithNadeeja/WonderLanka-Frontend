import "./TouristSetup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TouristSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    whatsapp: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:8085/api/onboarding/tourist-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      );

      if (!res.ok) {
        const text = await res.text();
        alert(text);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <h2>Complete Your Profile</h2>
        <p>Tell us a little about you</p>

        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          onChange={handleChange}
        />

        <input
          name="country"
          placeholder="Country"
          onChange={handleChange}
        />

        <input
          name="whatsapp"
          placeholder="WhatsApp Number"
          onChange={handleChange}
        />

        <button className="setup-btn" onClick={handleSubmit}>
          Continue
        </button>

        <p className="setup-note">
          Your number is only used for trip communication.
        </p>
      </div>
    </div>
  );
}

export default TouristSetup;
