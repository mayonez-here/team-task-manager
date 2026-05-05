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
      padding: "15px",
      background: "#111",
      color: "white"
    }}>
      
      {/* LEFT LINKS */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
        <Link to="/projects" style={{ color: "white" }}>Projects</Link>
        <Link to="/tasks" style={{ color: "white" }}>Tasks</Link>

        {user?.role === "admin" && (
          <Link to="/admin" style={{ color: "white" }}>Admin</Link>
        )}
      </div>

      {/* LOGOUT */}
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}
