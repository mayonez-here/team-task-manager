import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      background: "#111",
      color: "white"
    }}>
      
      {/* 🔥 APP NAME */}
      <h2 style={{ margin: 0 }}>🚀 Team Task Manager</h2>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
        <Link to="/projects" style={{ color: "white" }}>Projects</Link>
        <Link to="/tasks" style={{ color: "white" }}>Tasks</Link>

        {user?.role === "admin" && (
          <Link to="/admin" style={{ color: "white" }}>Admin</Link>
        )}
      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}
