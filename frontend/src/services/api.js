import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-self-ten.vercel.app/"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
