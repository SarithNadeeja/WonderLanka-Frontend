import { useEffect, useState } from "react";
import "./AdminVerification.css";

/**
 * Convert stored file path -> public URL
 * Example:
 * uploads\LicenseVerification\user-2\front.jpg
 * -> http://localhost:8085/uploads/LicenseVerification/user-2/front.jpg
 */
const toPublicUrl = (path) => {
  if (!path) return "";

  return path
    .replace(/\\/g, "/")                // Windows slashes → web slashes
    .replace(
      /^uploads/,
      "http://localhost:8085/uploads"   // map to Spring static handler
    );
};

function AdminDrivingLicense() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:8085/api/admin/license-verifications/pending",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch license verifications");
          setRequests([]);
          return;
        }

        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Error loading license verifications", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [adminToken]);

  if (loading) {
    return <h2>Loading license verification requests...</h2>;
  }

  return (
    <div className="glass-container">
      <h1>Driving License Verification</h1>

      {requests.length === 0 && (
        <p>No pending license verification requests.</p>
      )}

      {requests.map(req => (
        <div key={req.verificationId} className="glass-card">

          <div className="card-header">
            <h3>User ID: {req.userId}</h3>
            <span className={`status ${req.status.toLowerCase()}`}>
              {req.status}
            </span>
          </div>

          <div className="license-images">
            {req.files?.length > 0 ? (
              req.files.map(file => (
                <div key={file.id} className="image-box">
                  <p>{file.fileSide}</p>

                  <img
                    src={toPublicUrl(file.filePath)}
                    alt={file.fileSide}
                    loading="lazy"
                  />
                </div>
              ))
            ) : (
              <p>No files uploaded.</p>
            )}
          </div>

          <div className="action-buttons">
            <button className="approve-btn" disabled>
              Approve
            </button>
            <button className="reject-btn" disabled>
              Reject
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

export default AdminDrivingLicense;
