import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectMembers, setProjectMembers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDashboard();

    if (user?.role === "admin") {
      fetchUsers();
      fetchProjects();
    }
  }, []);

  // ---------------- DASHBOARD STATS ----------------
  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- ADMIN USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- ADMIN PROJECTS ----------------
  const fetchProjects = async () => {
    try {
      const res = await API.get("/my-projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- ADD MEMBER ----------------
  const addMember = async (userId) => {
    try {
      if (!selectedProject) {
        alert("Select a project first");
        return;
      }

      const res = await API.post("/add-member", {
        project_id: Number(selectedProject),
        user_id: userId
      });

      alert(res.data.msg || "User added");

      // 🔥 refresh members after adding
      fetchMembers(selectedProject);

    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.msg || "Failed to add member");
    }
  };

  // ---------------- FETCH PROJECT MEMBERS ----------------
  const fetchMembers = async (projectId) => {
    try {
      if (!projectId) return;

      const res = await API.get(`/project-members/${projectId}`);
      setProjectMembers(res.data.members);

    } catch (err) {
      console.log(err.response?.data || err);
      setProjectMembers([]);
    }
  };

  const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

  return (
    <Layout>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Dashboard 📊</h2>

        {/* ---------------- STATS ---------------- */}
        {!data ? (
          <p>Loading...</p>
        ) : (
          <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px"
}}>
  
  <div style={cardStyle}>
    <h2>{data.total_tasks}</h2>
    <p>Total Tasks</p>
  </div>

  <div style={cardStyle}>
    <h2>{data.completed_tasks}</h2>
    <p>Completed</p>
  </div>

  <div style={cardStyle}>
    <h2>{data.pending_tasks}</h2>
    <p>Pending</p>
  </div>

  <div style={cardStyle}>
    <h2>{data.overdue_tasks}</h2>
    <p>Overdue</p>
  </div>

</div>
        )}

        {/* ---------------- ADMIN PANEL ---------------- */}
        {user?.role === "admin" && (
          <div style={{ marginTop: "40px" }}>
            <h2>Admin Panel 👑</h2>

            {/* PROJECT SELECT */}
            <div style={{ marginBottom: "20px" }}>
              <select
                value={selectedProject}
                onChange={(e) => {
                  const pid = e.target.value;
                  setSelectedProject(pid);
                  fetchMembers(pid); // 🔥 IMPORTANT FIX
                }}
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ---------------- PROJECT MEMBERS ---------------- */}
            {selectedProject && (
              <div style={{ marginBottom: "20px" }}>
                <h3>Project Members 👥</h3>

                {projectMembers.length === 0 ? (
                  <p>No members in this project</p>
                ) : (
                  projectMembers.map((m) => (
                    <div key={m.id}>
                      {m.name} ({m.email})
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ---------------- USERS LIST ---------------- */}
            <h3>All Users</h3>

            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  background: "#f2f2f2",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <b>{u.name}</b> - {u.email} ({u.role})
                </div>

                <button onClick={() => addMember(u.id)}>
                  Add to Project
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}