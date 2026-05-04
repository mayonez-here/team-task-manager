import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProjects();
  }, []);

  // ----------------------------
  // GET PROJECTS
  // ----------------------------
  const fetchProjects = async () => {
    try {
      const res = await API.get("/my-projects");
      setProjects(res.data);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Failed to load projects");
    }
  };

  // ----------------------------
  // CREATE PROJECT (ADMIN ONLY)
  // ----------------------------
  const createProject = async () => {
    if (!name) {
      alert("Enter project name");
      return;
    }

    try {
      await API.post("/create-project", { name });

      setName("");
      fetchProjects();

    } catch (err) {
      console.log(err.response?.data);

      alert(
        err.response?.data?.msg ||
        "Only admin can create projects"
      );
    }
  };

  return (
    <Layout>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Projects 📁</h2>

        {/* CREATE PROJECT (HIDE FOR NON-ADMIN OPTIONAL UX) */}
        {user?.role === "admin" && (
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button onClick={createProject}>
              Create
            </button>
          </div>
        )}

        {/* IF NOT ADMIN */}
        {user?.role !== "admin" && (
          <p style={{ color: "gray" }}>
            Only admin can create projects
          </p>
        )}

        {/* PROJECT LIST */}
        <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "15px"
}}>
  {projects.map(p => (
    <div key={p.id} style={{
      background: "white",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer"
    }}>
      <h3>{p.name}</h3>
      <p>ID: {p.id}</p>
    </div>
  ))}
</div>
      </div>
    </Layout>
  );
}