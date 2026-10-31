import axios from "axios";

// Base URL of the backend (used for API calls and image URLs). Configurable for deployment.
export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const imageUrl = (path) => `${BACKEND_URL}/api/images/${path}`;

const API = axios.create({
  baseURL: BACKEND_URL + "/api",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401/403
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;