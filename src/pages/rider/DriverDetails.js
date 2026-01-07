function DriverDetails() {
  return (
    <>

      {/* ===== PROFILE PHOTO ===== */}
      <div className="profile-photo-section">
        <div className="profile-photo-wrapper">
          <div className="profile-photo-circle">
            {/* Default initials */}
            <span className="profile-initials">U</span>

            {/* Upload overlay */}
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
            <input type="text" />
          </div>

          <div>
            <label>2. Last Name :</label>
            <input type="text" />
          </div>

          <div>
            <label>3. Gender :</label>
            <select>
              <option>Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label>4. Birthday :</label>
            <input type="date" />
          </div>
        </div>

        <div className="form-actions">
          <button className="primary-btn">
            Save Personal Details
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
