import { useState, useEffect } from "react";

function VehicleDetails() {

  // ===== VEHICLE DETAILS STATE =====
  const [formData, setFormData] = useState({
    vehicleType: "",
    vehicleBrand: "",
    vehicleModel: "",
    regNo: "",
    year: ""
  });

  const [hasData, setHasData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ===== VEHICLE IMAGE STATE =====
  const [vehicleImage, setVehicleImage] = useState(null);

  const token = localStorage.getItem("token");

  // ===== INSURANCE VERIFICATION STATE =====
const [insuranceStatus, setInsuranceStatus] = useState("NOT_SUBMITTED");
const [showInsuranceModal, setShowInsuranceModal] = useState(false);
const [insuranceFront, setInsuranceFront] = useState(null);
const [insuranceBack, setInsuranceBack] = useState(null);
const [uploadingInsurance, setUploadingInsurance] = useState(false);


useEffect(() => {
  const fetchInsuranceStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/insurance-verification/status",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) return;

      const status = await response.text();
      setInsuranceStatus(status);

    } catch (err) {
      console.error("Failed to load insurance status", err);
    }
  };

  fetchInsuranceStatus();
}, [token]);



  // ==============================
  // LOAD VEHICLE DETAILS
  // ==============================
  useEffect(() => {
    const fetchVehicleDetails = async () => {
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
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Failed to load vehicle details", err);
      }
    };

    fetchVehicleDetails();
  }, [token]);

  // ==============================
  // LOAD VEHICLE PROFILE IMAGE
  // ==============================
  useEffect(() => {
    const fetchVehicleImage = async () => {
      try {
        const response = await fetch(
          "http://localhost:8085/api/rider/vehicle-profile-picture",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) return;

        const imageUrl = await response.text();

        if (imageUrl) {
          setVehicleImage(
            `http://localhost:8085${imageUrl}?t=${Date.now()}`
          );
        }
      } catch (err) {
        console.error("Failed to load vehicle image", err);
      }
    };

    fetchVehicleImage();
  }, [token]);

  // ==============================
  // FORM HANDLERS
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {

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

      setHasData(true);
      setIsEditing(false);
      alert("Vehicle details saved successfully");

    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save vehicle details");
    }
  };

  // ==============================
  // VEHICLE IMAGE UPLOAD / UPDATE
  // ==============================
  const handleVehicleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/vehicle-profile-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: uploadData
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const imagePath = await response.text();

      setVehicleImage(
        `http://localhost:8085${imagePath}?t=${Date.now()}`
      );

    } catch (err) {
      console.error("Vehicle image upload failed", err);
      alert("Failed to upload vehicle image");
    }
  };

  // ==============================
  // VEHICLE IMAGE DELETE
  // ==============================
  const handleVehicleImageDelete = async () => {
    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/vehicle-profile-picture",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setVehicleImage(null);

    } catch (err) {
      console.error("Vehicle image delete failed", err);
      alert("Failed to delete vehicle image");
    }
  };

      const handleInsuranceUpload = async () => {
      if (!insuranceFront || !insuranceBack) return;

      setUploadingInsurance(true);

      const uploadData = new FormData();
      uploadData.append("front", insuranceFront);
      uploadData.append("back", insuranceBack);

      try {
        const response = await fetch(
          "http://localhost:8085/api/rider/insurance-verification/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: uploadData
          }
        );

        if (!response.ok) throw new Error();

        // 🔥 UPDATE UI FROM DB LOGIC
        setInsuranceStatus("PENDING");

        setShowInsuranceModal(false);
        setInsuranceFront(null);
        setInsuranceBack(null);

      } catch {
        alert("Failed to upload insurance documents");
      } finally {
        setUploadingInsurance(false);
      }
    };


  const isLocked = hasData && !isEditing;

  return (
    <>
      {/* ===== VEHICLE PROFILE PHOTO ===== */}
      <div className="profile-photo-section">
        <div className="profile-photo-wrapper">

          <div className="profile-photo-circle">
            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt="Vehicle"
                className="profile-photo-img"
              />
            ) : (
              <span className="profile-initials">V</span>
            )}
          </div>

          {/* ===== ACTION BUTTONS BELOW PHOTO ===== */}
          <div className="photo-actions">

            {!vehicleImage && (
              <label className="primary-btn">
                Upload profile picture
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleVehicleImageUpload}
                />
              </label>
            )}

            {vehicleImage && (
              <>
                <label className="secondary-btn">
                  Update profile picture
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleVehicleImageUpload}
                  />
                </label>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleVehicleImageDelete}
                >
                  Delete profile picture
                </button>
              </>
            )}

          </div>

        </div>
      </div>

      {/* ===== VEHICLE COMMON DETAILS ===== */}
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

            {insuranceStatus === "NOT_SUBMITTED" && (
              <button
                className="upload-btn"
                onClick={() => setShowInsuranceModal(true)}
              >
                Upload
              </button>
            )}

            <span
              className={`status ${
                insuranceStatus === "PENDING" ? "pending" : "not-verified"
              }`}
            >
              {insuranceStatus === "PENDING"
                ? "Pending"
                : "Not Verified"}
            </span>
          </div>

        </div>
      </div>

      {/* ===== VEHICLE EXTRA PHOTOS ===== */}
      <div className="profile-card">
        <h3>Vehicle Photos (up to 5)</h3>

        <div className="vehicle-photo-grid">
          {[1, 2, 3, 4, 5].map(slot => (
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

      {/* ===== INSURANCE UPLOAD MODAL ===== */}
      {showInsuranceModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h3>Vehicle Insurance Upload</h3>

            <div className="modal-field">
              <label>Front Side</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setInsuranceFront(e.target.files[0])}
              />
              {insuranceFront && <small>{insuranceFront.name}</small>}
            </div>

            <div className="modal-field">
              <label>Back Side</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setInsuranceBack(e.target.files[0])}
              />
              {insuranceBack && <small>{insuranceBack.name}</small>}
            </div>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                disabled={uploadingInsurance}
                onClick={() => {
                  setShowInsuranceModal(false);
                  setInsuranceFront(null);
                  setInsuranceBack(null);
                }}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                disabled={!insuranceFront || !insuranceBack || uploadingInsurance}
                onClick={handleInsuranceUpload}
              >
                {uploadingInsurance ? "Uploading..." : "Continue"}
              </button>
            </div>

          </div>
        </div>
      )}

      
    </>
  );
}

export default VehicleDetails;
