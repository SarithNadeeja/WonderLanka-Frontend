function RiderProfileHeader() {
  const userId = 12; // TEMP
  const name = `User${userId}`;
  const status = "NOT VERIFIED"; // PENDING | VERIFIED

  return (
    <div className="glass-card profile-header">
      <div className="profile-left">
        <div className="avatar large">{name.slice(0,2)}</div>

        <div>
          <h2>{name}</h2>
          <span className={`status ${status.toLowerCase()}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="profile-actions">
        <button>Upload Photo</button>
        <button className="danger">Remove</button>
      </div>
    </div>
  );
}

export default RiderProfileHeader;
