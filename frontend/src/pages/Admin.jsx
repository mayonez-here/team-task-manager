import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";


export default function Admin() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  // GET USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Not allowed (Admin only)");
    }
  };

  // GET PROJECTS (ADMIN CAN SEE ALL)
  const fetchProjects = async () => {
    try {
      const res = await API.get("/my-projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ADD MEMBER TO PROJECT
  const addMember = async (userId) => {
    if (!selectedProject) {
      alert("Select a project first");
      return;
    }

    try {
      setLoading(true);

      await API.post("/add-member", {
        project_id: selectedProject,
        user_id: userId
      });

      alert("User added to project ✅");

    } catch (err) {
  console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);

  alert(err.response?.data?.msg || "Failed to add member");
} finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Admin Panel 👑</h2>

        {/* PROJECT SELECTOR */}
        <div style={{ marginBottom: "20px" }}>
          <h3>Select Project</h3>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">-- Select Project --</option>

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* USERS LIST */}
        <h3>Users</h3>

        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              style={{
                padding: "10px",
                margin: "10px 0",
                background: "#f2f2f2",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <p><b>{u.name}</b></p>
                <p>{u.email}</p>
                <p>{u.role}</p>
              </div>

              <button
                onClick={() => addMember(u.id)}
                disabled={loading}
                style={{
                  padding: "8px",
                  background: "green",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Add to Project
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}