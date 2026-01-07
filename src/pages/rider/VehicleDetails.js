function VehicleDetails() {
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

          <p className="photo-hint">Upload Vehicle Photo</p>
        </div>
      </div>

      <div className="profile-card">
        <h3>Vehicle Common Details</h3>

        <div className="form-grid">
          <div>
            <label>1. Vehicle Type :</label>
            <select>
              <option>Select</option>
              <option>Car</option>
              <option>Bike</option>
              <option>Van</option>
            </select>
          </div>

          <div>
            <label>2. Vehicle Brand :</label>
            <select>
              <option>Select</option>
              <option>Toyota</option>
              <option>Honda</option>
              <option>Suzuki</option>
            </select>
          </div>

          <div>
            <label>3. Vehicle Model :</label>
            <select>
              <option>Select</option>
              <option>Model 1</option>
              <option>Model 2</option>
            </select>
          </div>

          <div>
            <label>4. Vehicle Registration Number :</label>
            <input type="text" />
          </div>

          <div>
            <label>5. Vehicle Manufacturer Year :</label>
            <input type="text" />
          </div>
        </div>

        <div className="form-actions">
          <button className="primary-btn">
            Save Vehicle Details
          </button>
        </div>


      </div>
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
