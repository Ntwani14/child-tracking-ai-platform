import axios from "axios";

// Base URL of the backend (used for API calls and image URLs). Configurable for deployment.
export const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
// If path is already a full URL (Cloudinary), use it directly.
// If it is a legacy local filename, proxy it through the backend.
export const imageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_URL}/api/images/${path}`;
};

const API = axios.create({
  baseURL: BACKEND_URL + "/api",
  timeout: 60000, // 60 seconds — handles Render free tier cold start
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login only on 401 (token expired or missing)
// 403 means forbidden (e.g. validation error or wrong role) — do NOT log out
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;