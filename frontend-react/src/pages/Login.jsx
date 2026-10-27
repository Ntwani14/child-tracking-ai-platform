import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🔍</div>
          <h1>Missing Children System</h1>
          <p>Community-Based Reporting Platform</p>
        </div>
        <div className={styles.card}>
          <h2>Sign In</h2>
          <p className={styles.subtitle}>Enter your credentials to continue</p>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" required value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button className={styles.btn} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className={styles.footer}>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}