import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import styles from "./AuthNew.module.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = request code, 2 = enter code + new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setInfo(data.message || "If an account exists for that email, a reset code has been sent.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    if (newPassword !== confirm) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { code: code.trim(), newPassword });
      setInfo("Password reset successful! Redirecting to sign in...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired reset code.");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <Link to="/login" className={styles.backBtn}>&larr; Back to Sign In</Link>
        <div className={styles.leftContent}>
          <div className={styles.leftIcon}>&#128273;</div>
          <h1 className={styles.leftTitle}>Reset your password</h1>
          <p className={styles.leftSub}>
            We will email you a 6-digit code so you can securely set a new password for your account.
          </p>
        </div>
        <div className={styles.leftFooter}>ISJ107V &middot; Tshwane University of Technology &middot; 2026</div>
      </div>

      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2>{step === 1 ? "Forgot password" : "Enter reset code"}</h2>
            <p>{step === 1
              ? "Enter the email linked to your account"
              : "Check your email for the 6-digit code and choose a new password"}</p>
          </div>

          {error && <div className={styles.error}>&#9888; {error}</div>}
          {info && <div className={styles.success}>{info}</div>}

          {step === 1 ? (
            <form onSubmit={requestCode} className={styles.form}>
              <div className={styles.field}>
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" required value={email}
                  onChange={e => setEmail(e.target.value)} />
              </div>
              <button className={styles.btn} disabled={loading}>
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitReset} className={styles.form}>
              <div className={styles.field}>
                <label>6-Digit Code</label>
                <input type="text" inputMode="numeric" maxLength={6} placeholder="123456" required value={code}
                  onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ""))} />
              </div>
              <div className={styles.field}>
                <label>New Password</label>
                <input type="password" placeholder="At least 6 characters" required value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Confirm New Password</label>
                <input type="password" placeholder="Re-enter new password" required value={confirm}
                  onChange={e => setConfirm(e.target.value)} />
              </div>
              <button className={styles.btn} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button type="button" className={styles.linkBtn} onClick={() => { setStep(1); setError(""); setInfo(""); }}>
                Did not get a code? Try again
              </button>
            </form>
          )}

          <div className={styles.divider}><span>Remember your password?</span></div>
          <Link to="/login" className={styles.altBtn}>Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}