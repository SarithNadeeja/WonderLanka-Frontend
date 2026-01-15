import Sidebar from "./AdminSidebar"; // adjust path if needed
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}

export default AdminDashboard;
