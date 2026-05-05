import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
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
      
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
        <Link to="/projects" style={{ color: "white" }}>Projects</Link>
        <Link to="/tasks" style={{ color: "white" }}>Tasks</Link>
        
      </div>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}
