import { useState, useEffect } from "react";

function DriverDetails() {

  // ===== STATE =====
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthday: ""
  });

  const [hasData, setHasData] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 👈 STEP 2

  // ===== LOAD EXISTING DATA =====
  useEffect(() => {
    const fetchPersonalDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8085/api/rider/personal-details",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        if (data) {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            gender: data.gender || "",
            birthday: data.birthday || ""
          });

          setHasData(true);
          setIsEditing(false); // start locked
        }

      } catch (error) {
        console.error("Failed to load rider details", error);
      }
    };

    fetchPersonalDetails();
  }, []);

  // ===== HANDLERS =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  // STEP 2 behavior: unlock form
  if (hasData && !isEditing) {
    setIsEditing(true);
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8085/api/rider/personal-details",
      {
        method: hasData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      }
    );

    if (!response.ok) {
      const text = await response.text();
      alert(`Error ${response.status}: ${text}`);
      return;
    }

    const data = await response.json();
    console.log("Saved rider details:", data);

    setHasData(true);
    setIsEditing(false); // 🔒 re-lock after save

    alert("Changes saved successfully");

  } catch (error) {
    console.error("Save failed", error);
    alert("Failed to save changes");
  }
};


  const isLocked = hasData && !isEditing;

  return (
    <>

      {/* ===== PROFILE PHOTO ===== */}
      <div className="profile-photo-section">
        <div className="profile-photo-wrapper">
          <div className="profile-photo-circle">
            <span className="profile-initials">U</span>
            <label className="photo-upload-btn">
              +
              <input type="file" hidden />
            </label>
          </div>
          <p className="photo-hint">Upload profile photo</p>
        </div>
      </div>

      <div className="profile-card">
        <h3>Rider Personal Details</h3>

        <div className="form-grid">
          <div>
            <label>1. First Name :</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLocked}
            />
          </div>

          <div>
            <label>2. Last Name :</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLocked}
            />
          </div>

          <div>
            <label>3. Gender :</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isLocked}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label>4. Birthday :</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              disabled={isLocked}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="primary-btn"
            onClick={handleSubmit}
          >
            {!hasData
              ? "Save Personal Details"
              : isEditing
                ? "Save Changes"
                : "Click to Update"}
          </button>
        </div>
      </div>

      <div className="profile-card">
        <h3>Rider Verification Details</h3>

        <div className="verification-grid">
          <div className="verify-item">
            <span>1. Phone number :</span>
            <input
              type="text"
              placeholder="07XXXXXXXX"
              className="verify-input"
            />
            <span className="status not-verified">Not Verified</span>
          </div>

          <div className="verify-item">
            <span>2. Driving License Verification</span>
            <button className="upload-btn">Upload</button>
            <span className="status not-verified">Not Verified</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default DriverDetails;
