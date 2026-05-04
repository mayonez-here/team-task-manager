import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful 🚀");

      window.location.href = "/dashboard";

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      {/* 🔥 SIGNUP BUTTON */}
      <div style={{ marginTop: "20px" }}>
        <p>Don't have an account?</p>

        <button
          onClick={() => (window.location.href = "/signup")}
          style={{
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}