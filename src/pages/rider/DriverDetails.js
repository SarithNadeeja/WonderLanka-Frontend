import { useState, useEffect } from "react";

function DriverDetails() {

  // ===== PERSONAL DETAILS STATE =====
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthday: ""
  });

  const [hasData, setHasData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ===== PROFILE IMAGE STATE =====
  const [profileImage, setProfileImage] = useState(null);

  // ===== LICENSE VERIFICATION STATE =====
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState("NOT_SUBMITTED");


  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchLicenseStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/license-verification/status",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) return;

      const status = await response.text();
      setLicenseStatus(status);

    } catch (err) {
      console.error("Failed to load license status", err);
    }
  };

  fetchLicenseStatus();
}, [token]);


  // ==============================
  // LOAD PERSONAL DETAILS
  // ==============================
  useEffect(() => {
    const fetchPersonalDetails = async () => {
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
          setIsEditing(false);
        }
      } catch (err) {
        console.error("Failed to load rider details", err);
      }
    };

    fetchPersonalDetails();
  }, [token]);

  // ==============================
  // LOAD PROFILE IMAGE
  // ==============================
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(
          "http://localhost:8085/api/rider/rider-profile-picture",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) return;

        const imageUrl = await response.text();

        if (imageUrl) {
          setProfileImage(
            `http://localhost:8085${imageUrl}?t=${Date.now()}`
          );
        }
      } catch (err) {
        console.error("Failed to load profile image", err);
      }
    };

    fetchProfileImage();
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

      setHasData(true);
      setIsEditing(false);
      alert("Changes saved successfully");

    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes");
    }
  };

  // ==============================
  // PROFILE IMAGE UPLOAD / UPDATE
  // ==============================
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/rider-profile-picture",
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

      setProfileImage(
        `http://localhost:8085${imagePath}?t=${Date.now()}`
      );

    } catch (err) {
      console.error("Profile upload failed", err);
      alert("Failed to upload profile picture");
    }
  };

  // ==============================
  // PROFILE IMAGE DELETE
  // ==============================
  const handleProfileImageDelete = async () => {
    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/rider-profile-picture",
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

      setProfileImage(null);

    } catch (err) {
      console.error("Profile image delete failed", err);
      alert("Failed to delete profile picture");
    }
  };

  const isLocked = hasData && !isEditing;

  // ==============================
  // LICENSE UPLOAD HANDLER (BACKEND)
  // ==============================
  const handleLicenseUpload = async () => {
    if (!licenseFront || !licenseBack) return;

    setUploadingLicense(true);

    const uploadData = new FormData();
    uploadData.append("front", licenseFront);
    uploadData.append("back", licenseBack);

    try {
      const response = await fetch(
        "http://localhost:8085/api/rider/license-verification/upload",
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

      alert("Driving license uploaded successfully");

      setLicenseStatus("PENDING");

      setShowLicenseModal(false);
      setLicenseFront(null);
      setLicenseBack(null);

    } catch (err) {
      console.error("License upload failed", err);
      alert("Failed to upload driving license");
    } finally {
      setUploadingLicense(false);
    }
  };

  return (
    <>
      {/* ===== PROFILE PHOTO ===== */}
      <div className="profile-photo-section">
        <div className="profile-photo-wrapper">

          <div className="profile-photo-circle">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-photo-img"
              />
            ) : (
              <span className="profile-initials">U</span>
            )}
          </div>

          <div className="photo-actions">

            {!profileImage && (
              <label className="primary-btn">
                Upload profile picture
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfileUpload}
                />
              </label>
            )}

            {profileImage && (
              <>
                <label className="secondary-btn">
                  Update profile picture
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProfileUpload}
                  />
                </label>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleProfileImageDelete}
                >
                  Delete profile picture
                </button>
              </>
            )}

          </div>

        </div>
      </div>

      {/* ===== PERSONAL DETAILS ===== */}
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
          <button className="primary-btn" onClick={handleSubmit}>
            {!hasData
              ? "Save Personal Details"
              : isEditing
                ? "Save Changes"
                : "Click to Update"}
          </button>
        </div>
      </div>

      {/* ===== VERIFICATION ===== */}
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

          {licenseStatus === "NOT_SUBMITTED" && (
            <button
              className="upload-btn"
              onClick={() => setShowLicenseModal(true)}
            >
              Upload
            </button>
          )}

          <span
            className={`status ${
              licenseStatus === "PENDING"
                ? "pending"
                : licenseStatus === "APPROVED"
                ? "verified"
                : licenseStatus === "REJECTED"
                ? "rejected"
                : "not-verified"
            }`}
          >
            {licenseStatus === "PENDING" && "Pending"}
            {licenseStatus === "APPROVED" && "Verified"}
            {licenseStatus === "REJECTED" && "Rejected"}
            {licenseStatus === "NOT_SUBMITTED" && "Not Verified"}
          </span>
        </div>


        </div>
      </div>

      {/* ===== LICENSE UPLOAD MODAL ===== */}
      {showLicenseModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h3>Driving License Upload</h3>

            <div className="modal-field">
              <label>Front Side</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLicenseFront(e.target.files[0])}
              />
              {licenseFront && <small>{licenseFront.name}</small>}
            </div>

            <div className="modal-field">
              <label>Back Side</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLicenseBack(e.target.files[0])}
              />
              {licenseBack && <small>{licenseBack.name}</small>}
            </div>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                disabled={uploadingLicense}
                onClick={() => {
                  setShowLicenseModal(false);
                  setLicenseFront(null);
                  setLicenseBack(null);
                }}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                disabled={!licenseFront || !licenseBack || uploadingLicense}
                onClick={handleLicenseUpload}
              >
                {uploadingLicense ? "Uploading..." : "Continue"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default DriverDetails;
