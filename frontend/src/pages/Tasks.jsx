import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // ----------------------------
  // LOAD PROJECTS
  // ----------------------------
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/my-projects");
      setProjects(res.data);

      // ✅ AUTO SELECT FIRST PROJECT
      if (res.data.length > 0) {
        const firstId = res.data[0].id;
        setSelectedProject(firstId);
        fetchTasks(firstId);
      }
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Failed to load projects");
    }
  };

  // ----------------------------
  // LOAD TASKS
  // ----------------------------
  const fetchTasks = async (pid) => {
    try {
      const projectId = pid || selectedProject;

      if (!projectId) return;

      const res = await API.get(`/project-tasks/${projectId}`);
      setTasks(res.data);

    } catch (err) {
      console.log("TASK FETCH ERROR:", err.response?.data);

      // 🔥 IMPORTANT: show backend reason
      if (err.response?.status === 403) {
        setTasks([]);
        alert("You are not allowed to view tasks in this project");
        return;
      }

      alert(err.response?.data?.msg || "Failed to load tasks");
    }
  };

  // ----------------------------
  // CREATE TASK (ADMIN ONLY)
  // ----------------------------
  const createTask = async () => {
    if (!title || !selectedProject) {
      alert("Please enter task and select project");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await API.post("/create-task", {
        title,
        project_id: Number(selectedProject), // ✅ FIX TYPE ISSUE
        assigned_to: user.id,
        due_date: "2026-05-10"
      });

      setTitle("");
      fetchTasks(selectedProject);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Only admin can create tasks");
    }
  };

  // ----------------------------
  // UPDATE STATUS (MEMBER + ADMIN)
  // ----------------------------
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/update-task/${id}`, { status });
      fetchTasks(selectedProject);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  // ----------------------------
  // DELETE TASK (ADMIN ONLY)
  // ----------------------------
  const deleteTask = async (id) => {
    try {
      await API.delete(`/delete-task/${id}`);
      fetchTasks(selectedProject);

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Only admin can delete tasks");
    }
  };

  return (
    <Layout>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h2>Tasks 📌</h2>

        {/* CREATE TASK */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: "10px" }}
          />

          <select
            value={selectedProject}
            onChange={(e) => {
              const val = Number(e.target.value); // ✅ FIX TYPE
              setSelectedProject(val);
              fetchTasks(val);
            }}
            style={{ marginRight: "10px" }}
          >
            <option value="">Select Project</option>

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button onClick={createTask}>
            Create Task
          </button>
        </div>

        {/* TASK LIST */}
        <div>
          {tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  background: "#f2f2f2"
                }}
              >
                <h4>{t.title}</h4>
                <p>Status: {t.status}</p>

                <button onClick={() => updateStatus(t.id, "done")}>
                  Mark Done
                </button>

                <button onClick={() => updateStatus(t.id, "pending")}>
                  Mark Pending
                </button>

                <button
                  onClick={() => deleteTask(t.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}