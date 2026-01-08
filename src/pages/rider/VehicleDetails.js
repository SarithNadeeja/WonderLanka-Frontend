import { useState, useEffect } from "react";

function VehicleDetails() {

  // ===== STATE (MATCH BACKEND EXACTLY) =====
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    regNo: "",
    year: ""
  });

  const [hasData, setHasData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ===== LOAD EXISTING VEHICLE DATA =====
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:8085/api/rider/vehicle-common-details",
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
            vehicleType: data.vehicleType || "",
            vehicleBrand: data.vehicleBrand || "",
            vehicleModel: data.vehicleModel || "",
            regNo: data.regNo || "",
            year: data.year || ""
          });

          setHasData(true);
          setIsEditing(false); // locked by default
        }

      } catch (error) {
        console.error("Failed to load vehicle details", error);
      }
    };

    fetchVehicleDetails();
  }, []);

  // ===== HANDLERS =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    // STEP 1: unlock
    if (hasData && !isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/vehicle-common-details",
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
      console.log("Saved vehicle details:", data);

      setHasData(true);
      setIsEditing(false); // 🔒 re-lock

      alert("Vehicle details saved successfully");

    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save vehicle details");
    }
  };

  const isLocked = hasData && !isEditing;

  return (
    <>
      {/* ===== VEHICLE PHOTO ===== */}
      <div className="profile-photo-section">
        <div className="profile-photo-wrapper">
          <div className="profile-photo-circle">
            <span className="profile-initials">V</span>
            <label className="photo-upload-btn">
              +
              <input type="file" hidden />
            </label>
          </div>
          <p className="photo-hint">Upload Vehicle Photo</p>
        </div>
      </div>

      <div className="profile-card">
        <h3>Vehicle Common Details</h3>

        <div className="form-grid">

          <div>
            <label>1. Vehicle Type :</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              disabled={isLocked}
            >
              <option value="">Select</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Van">Van</option>
            </select>
          </div>

          <div>
            <label>2. Vehicle Brand :</label>
            <select
              name="vehicleBrand"
              value={formData.vehicleBrand}
              onChange={handleChange}
              disabled={isLocked}
            >
              <option value="">Select</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Suzuki">Suzuki</option>
            </select>
          </div>

          <div>
            <label>3. Vehicle Model :</label>
            <select
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              disabled={isLocked}
            >
              <option value="">Select</option>
              <option value="Model 1">Model 1</option>
              <option value="Model 2">Model 2</option>
            </select>
          </div>

          <div>
            <label>4. Vehicle Registration Number :</label>
            <input
              type="text"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              disabled={isLocked}
            />
          </div>

          <div>
            <label>5. Vehicle Manufacturer Year :</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              disabled={isLocked}
            />
          </div>

        </div>

        <div className="form-actions">
          <button className="primary-btn" onClick={handleSubmit}>
            {!hasData
              ? "Save Details"
              : isEditing
                ? "Save Changes"
                : "Click to Update"}
          </button>
        </div>
      </div>

      {/* ===== VEHICLE VERIFICATION ===== */}
      <div className="profile-card">
        <h3>Vehicle Verification Details</h3>

        <div className="verification-grid">
          <div className="verify-item">
            <span>1. Vehicle Insurance Verification</span>
            <button className="upload-btn">Upload</button>
            <span className="status not-verified">Not Verified</span>
          </div>
        </div>
      </div>

      {/* ===== VEHICLE PHOTOS ===== */}
      <div className="profile-card">
        <h3>Vehicle Photos (up to 5)</h3>

        <div className="vehicle-photo-grid">
          {[1, 2, 3, 4, 5].map((slot) => (
            <label key={slot} className="vehicle-photo-slot">
              <span className="photo-plus">+</span>
              <input type="file" hidden />
            </label>
          ))}
        </div>

        <p className="photo-hint">
          Add clear photos of your vehicle (front, back, sides)
        </p>
      </div>
    </>
  );
}

export default VehicleDetails;
