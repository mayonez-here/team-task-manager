import { useEffect, useState } from "react";
import API from "../services/api";


export default function ProjectMembers() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  const fetchProjects = async () => {
    const res = await API.get("/my-projects");
    setProjects(res.data);
  };

  const addMember = async (userId) => {
    await API.post("/add-member", {
      project_id: selectedProject,
      user_id: userId
    });

    alert("Member added");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Project Members</h2>

      {/* Select Project */}
      <select onChange={(e) => setSelectedProject(e.target.value)}>
        <option>Select Project</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <h3>Users</h3>

      {users.map(u => (
        <div key={u.id} style={{ margin: "10px 0" }}>
          {u.name} ({u.email})

          <button
            onClick={() => addMember(u.id)}
            style={{ marginLeft: "10px" }}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}