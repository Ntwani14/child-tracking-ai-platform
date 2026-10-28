import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthNew.module.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:"", email:"", password:"", location:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>

      {/* Left Panel */}
      <div className={styles.left}>
        <Link to="/" className={styles.backBtn}>← Back to Home</Link>
        <div className={styles.leftContent}>
          <div className={styles.leftIcon}>🤝</div>
          <h1 className={styles.leftTitle}>Join the Community</h1>
          <p className={styles.leftSub}>Help South African communities find missing children faster by joining our platform today.</p>
          <div className={styles.leftFeatures}>
            {[
              "📋 Submit missing children reports instantly",
              "🔔 Receive alerts for your area automatically",
              "🤖 AI detects duplicate reports for you",
              "📊 View live analytics and reporting trends",
              "🛡️ Your data is secure and private",
            ].map(f => (
              <div key={f} className={styles.leftFeature}>{f}</div>
            ))}
          </div>
        </div>
        <div className={styles.leftFooter}>ISJ107V · Tshwane University of Technology · 2026</div>
      </div>

      {/* Right Panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2>Create your account</h2>
            <p>Free forever · No credit card required</p>
          </div>

          {error && <div className={styles.error}>⚠ {error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
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
              <label>Your Area <span className={styles.optional}>(for local alert notifications)</span></label>
              <input type="text" placeholder="e.g. Soshanguve, Pretoria" value={form.location}
                onChange={e => setForm({...form, location: e.target.value})} />
            </div>
            <button className={styles.btn} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <div className={styles.divider}><span>Already have an account?</span></div>

          <Link to="/login" className={styles.altBtn}>Sign In Instead</Link>

          <p className={styles.terms}>
            By registering you agree to use this platform responsibly for community safety purposes only.
          </p>
        </div>
      </div>

    </div>
  );
}