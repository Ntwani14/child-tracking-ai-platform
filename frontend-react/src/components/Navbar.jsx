import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    API.get("/notifications").then(r => setNotifications(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };
  const isActive = (path) => location.pathname === path ? styles.active : "";

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🔍</span>
        <span className={styles.brandText}>Missing Children System</span>
      </div>

      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>

      <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
        <Link className={`${styles.link} ${isActive("/")}`} to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link className={`${styles.link} ${isActive("/submit")}`} to="/submit" onClick={() => setMenuOpen(false)}>Report Missing Child</Link>
        <Link className={`${styles.link} ${isActive("/analytics")}`} to="/analytics" onClick={() => setMenuOpen(false)}>Analytics</Link>
        <Link className={`${styles.link} ${isActive("/admin")}`} to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>

        <div className={styles.notifWrap} ref={notifRef}>
          <button className={styles.bell} onClick={() => setShowNotif(!showNotif)}>
            🔔
            {notifications.length > 0 && (
              <span className={styles.badge}>{notifications.length}</span>
            )}
          </button>
          {showNotif && (
            <div className={styles.notifPanel}>
              <div className={styles.notifHeader}>Notifications</div>
              {notifications.length === 0
                ? <div className={styles.notifEmpty}>No notifications</div>
                : notifications.slice(0, 8).map(n => (
                    <div key={n.notificationId} className={styles.notifItem}
                      onClick={() => { navigate(`/reports/${n.reportId}`); setShowNotif(false); }}>
                      <div className={styles.notifMsg}>{n.message}</div>
                      <div className={styles.notifTime}>{new Date(n.sentAt).toLocaleString("en-ZA")}</div>
                    </div>
                  ))
              }
            </div>
          )}
        </div>

        <span className={styles.userName}>👤 {user?.name}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}