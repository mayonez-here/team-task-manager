import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "240px",
        background: "#0f172a",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ marginBottom: "30px" }}>⚡ Task SaaS</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link to="/dashboard" style={{ color: "white" }}>📊 Dashboard</Link>
          <Link to="/projects" style={{ color: "white" }}>📁 Projects</Link>
          <Link to="/tasks" style={{ color: "white" }}>📌 Tasks</Link>

          {user?.role === "admin" && (
            <Link to="/admin" style={{ color: "white" }}>👑 Admin</Link>
          )}
        </div>

        <button
          onClick={logout}
          style={{
            marginTop: "30px",
            padding: "10px",
            width: "100%",
            background: "red",
            color: "white",
            border: "none"
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, background: "#f4f6f8", padding: "20px" }}>
        {children}
      </div>

    </div>
  );
}