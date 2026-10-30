import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthNew.module.css";

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
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>

      {/* Left Panel */}
      <div className={styles.left}>
        <Link to="/" className={styles.backBtn}>← Back to Home</Link>
        <div className={styles.leftContent}>
          <div className={styles.leftIcon}>🔍</div>
          <h1 className={styles.leftTitle}>Missing Children System</h1>
          <p className={styles.leftSub}>AI-Enhanced Community-Based Reporting & Tracking Platform</p>
          <div className={styles.leftStats}>
            <div className={styles.leftStat}>
              <span className={styles.leftStatNum}>1,697</span>
              <span className={styles.leftStatLabel}>Children reported missing annually in South Africa</span>
            </div>
            <div className={styles.leftStat}>
              <span className={styles.leftStatNum}>30%</span>
              <span className={styles.leftStatLabel}>Faster community response with our platform</span>
            </div>
            <div className={styles.leftStat}>
              <span className={styles.leftStatNum}>100%</span>
              <span className={styles.leftStatLabel}>Free for all South African community members</span>
            </div>
          </div>
        </div>
        <div className={styles.leftFooter}>ISJ107V · Tshwane University of Technology · 2026</div>
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && <div className={styles.error}>⚠ {error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
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
            <div style={{textAlign:"right",marginTop:"-6px"}}>
              <Link to="/forgot-password" style={{color:"#2d6cdf",fontSize:"0.82rem",fontWeight:600}}>Forgot password?</Link>
            </div>
            <button className={styles.btn} disabled={loading}>
              {loading ? <span className={styles.spinner}>⏳ Signing in...</span> : "Sign In →"}
            </button>
          </form>

          <div className={styles.divider}><span>New to the platform?</span></div>

          <Link to="/register" className={styles.altBtn}>Create a Free Account</Link>

          <p className={styles.terms}>
            By signing in you agree to use this platform responsibly for community safety purposes only.
          </p>
        </div>
      </div>

    </div>
  );
}