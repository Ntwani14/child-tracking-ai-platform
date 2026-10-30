import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import styles from "./ReportDetail.module.css";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    API.get(`/reports/${id}`).then(r => setReport(r.data)).catch(() => navigate("/dashboard")).finally(() => setLoading(false));
  }, [id]);

  const shareReport = () => {
    const text = `MISSING CHILD ALERT: ${report.childName} (${report.gender}, ${report.age} years old) was last seen at ${report.lastSeenLocation} on ${new Date(report.dateLastSeen).toLocaleDateString("en-ZA")}. Description: ${report.physicalDescription}. Please share and contact authorities if you have any information.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const markAsFound = async () => {
    if (!confirm(`Are you sure you want to mark ${report.childName} as FOUND? This will notify all registered users.`)) return;
    setMarking(true);
    try {
      const { data } = await API.put(`/reports/${id}/found`);
      setReport(data);
      setMarked(true);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update report.");
    } finally { setMarking(false); }
  };

  const statusColor = { active: "#2e7d32", found: "#1565c0", duplicate: "#e65100" };

  if (loading) return <div><Navbar /><div className={styles.loading}>Loading...</div></div>;
  if (!report) return null;

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <button className={styles.back} onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

        {marked && (
          <div className={styles.successBanner}>
            🎉 Thank you! {report.childName} has been marked as found. All community members have been notified.
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.banner} style={{background: report.status === "found" ? "linear-gradient(135deg, #15803d, #16a34a)" : "linear-gradient(135deg, #1a3c6e, #2d6cdf)"}}>
            <span className={styles.badge}>
              {report.status === "found" ? "✓ FOUND" : report.status.toUpperCase()}
            </span>
            <h1>{report.childName}</h1>
            <p>{report.gender} · {report.age} years old · Last seen {new Date(report.dateLastSeen).toLocaleDateString("en-ZA", {day:"numeric",month:"long",year:"numeric"})}</p>
          </div>

          <div className={styles.body}>
            {report.imagePath
              ? <img src={`http://localhost:8080/api/images/${report.imagePath}`} alt={report.childName} className={styles.photo} />
              : <div className={styles.noPhoto}>📷 No photo uploaded</div>
            }

            <div className={styles.grid}>
              {[
                {label:"Age", value:`${report.age} years old`},
                {label:"Gender", value: report.gender},
                {label:"Last Seen Location", value: report.lastSeenLocation},
                {label:"Date Last Seen", value: new Date(report.dateLastSeen).toLocaleDateString("en-ZA",{day:"numeric",month:"long",year:"numeric"})},
              ].map(f => (
                <div key={f.label} className={styles.field}>
                  <span className={styles.fieldLabel}>{f.label}</span>
                  <span className={styles.fieldValue}>{f.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.description}>
              <span className={styles.fieldLabel}>Physical Description</span>
              <p>{report.physicalDescription}</p>
            </div>

            {/* Action buttons */}
            <div className={styles.actions}>
              <div className={styles.shareBox}>
                <p>Help find this child — share this report with your community</p>
                <button className={styles.shareBtn} onClick={shareReport}>
                  {copied ? "✓ Copied to Clipboard!" : "📤 Share Report"}
                </button>
              </div>

              {report.status === "active" && (
                <div className={styles.foundBox}>
                  <p>Did you see this child? Let the community know!</p>
                  <button className={styles.foundBtn} onClick={markAsFound} disabled={marking}>
                    {marking ? "Updating..." : "✅ I Found This Child!"}
                  </button>
                </div>
              )}

              {report.status === "found" && (
                <div className={styles.foundBanner}>
                  🎉 This child has been found! Thank you to everyone who helped.
                </div>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <span>Reported by: <strong>{report.submittedBy}</strong></span>
            <span className={styles.reportId}>ID: {report.reportId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}