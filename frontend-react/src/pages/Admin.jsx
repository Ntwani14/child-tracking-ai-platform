import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import styles from "./Admin.module.css";

export default function Admin() {
  const [flags, setFlags] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [f, r] = await Promise.all([
      API.get("/admin/duplicate-flags").catch(() => ({ data: [] })),
      API.get("/reports/all").catch(() => ({ data: [] }))
    ]);
    setFlags(f.data); setReports(r.data); setLoading(false);
  };

  const dismiss = async (id) => { if (!confirm("Dismiss this flag?")) return; await API.put(`/admin/duplicate-flags/${id}/dismiss`); loadAll(); };
  const merge = async (id) => { if (!confirm("Confirm as duplicate? The report will be hidden.")) return; await API.put(`/admin/duplicate-flags/${id}/merge`); loadAll(); };
  const updateStatus = async (reportId, status) => { if (!status) return; if (!confirm(`Change status to "${status}"?`)) return; await API.put(`/admin/reports/${reportId}/status`, { status }); loadAll(); };

  const statusColor = { active: "#2e7d32", found: "#1565c0", duplicate: "#e65100" };

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Admin Panel</h1>
          <p>Review AI-flagged duplicate reports and manage case statuses</p>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Pending Duplicate Flags
              {flags.length > 0 && <span className={styles.badge}>{flags.length}</span>}
            </h2>
            <button className={styles.btnOutline} onClick={loadAll}>Refresh</button>
          </div>

          {loading ? <div className={styles.loading}>Loading...</div>
          : flags.length === 0
            ? <div className={styles.empty}>✅ No pending duplicate flags. All reports reviewed.</div>
            : flags.map(f => (
              <div key={f.flagId} className={styles.flagCard}>
                <div className={styles.flagHeader}>
                  <span>🤖 AI detected <strong>{Math.round(f.similarityScore*100)}% similarity</strong></span>
                  <span className={styles.score}>{Math.round(f.similarityScore*100)}% match</span>
                </div>
                <div className={styles.flagBody}>
                  <div className={styles.reportBox}>
                    <div className={styles.boxLabel}>New Report</div>
                    <div className={styles.childName}>{f.report.childName}</div>
                    <div className={styles.detail}>👤 {f.report.gender}, {f.report.age} yrs</div>
                    <div className={styles.detail}>📍 {f.report.lastSeenLocation}</div>
                    <span className={styles.statusPill} style={{background: statusColor[f.report.status]+"22", color: statusColor[f.report.status]}}>{f.report.status.toUpperCase()}</span>
                  </div>
                  <div className={styles.vs}>VS</div>
                  <div className={styles.reportBox}>
                    <div className={styles.boxLabel}>Existing Report</div>
                    <div className={styles.childName}>{f.matchedReport.childName}</div>
                    <div className={styles.detail}>👤 {f.matchedReport.gender}, {f.matchedReport.age} yrs</div>
                    <div className={styles.detail}>📍 {f.matchedReport.lastSeenLocation}</div>
                    <span className={styles.statusPill} style={{background: statusColor[f.matchedReport.status]+"22", color: statusColor[f.matchedReport.status]}}>{f.matchedReport.status.toUpperCase()}</span>
                  </div>
                </div>
                <div className={styles.flagActions}>
                  <button className={styles.btnDismiss} onClick={() => dismiss(f.flagId)}>✓ Not a Duplicate — Dismiss</button>
                  <button className={styles.btnMerge} onClick={() => merge(f.flagId)}>⚠ Confirm Duplicate</button>
                </div>
              </div>
            ))
          }
        </div>

        <div className={styles.section}>
          <h2 style={{marginBottom:"16px"}}>All Reports — Update Status</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Child Name</th><th>Age</th><th>Location</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.reportId}>
                    <td><strong>{r.childName}</strong></td>
                    <td>{r.age}</td>
                    <td>{r.lastSeenLocation}</td>
                    <td><span className={styles.statusPill} style={{background: statusColor[r.status]+"22", color: statusColor[r.status]}}>{r.status.toUpperCase()}</span></td>
                    <td>
                      <select className={styles.statusSelect} defaultValue="" onChange={e => updateStatus(r.reportId, e.target.value)}>
                        <option value="">Change status...</option>
                        <option value="active" disabled={r.status==="active"}>Active</option>
                        <option value="found" disabled={r.status==="found"}>Found ✓</option>
                        <option value="duplicate" disabled={r.status==="duplicate"}>Duplicate</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}