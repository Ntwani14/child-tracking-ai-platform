import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", location: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
          <h2>Create Account</h2>
          <p className={styles.subtitle}>Join the community to help find missing children</p>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input type="text" placeholder="Your full name" required value={form.fullName}
                onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" required value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input type="password" placeholder="At least 6 characters" required minLength={6} value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Your Area <span className={styles.optional}>(for alert notifications)</span></label>
              <input type="text" placeholder="e.g. Soshanguve, Pretoria" value={form.location}
                onChange={e => setForm({...form, location: e.target.value})} />
            </div>
            <button className={styles.btn} disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className={styles.footer}>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
}