import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import styles from "./ReportDetail.module.css";

// Real brand logos as inline SVG (no external dependency needed)
const Icons = {
  whatsapp: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.511 5.26l-.999 3.648 3.477-.907zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M1.5 4.5h21A1.5 1.5 0 0124 6v12a1.5 1.5 0 01-1.5 1.5h-21A1.5 1.5 0 010 18V6a1.5 1.5 0 011.5-1.5zM12 12.713L2.146 6.5h19.708L12 12.713zM0 7.55V18a1.5 1.5 0 001.5 1.5h21A1.5 1.5 0 0024 18V7.55l-11.49 7.247a1 1 0 01-1.02 0L0 7.55z"/></svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  ),
};

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tiktokCopied, setTiktokCopied] = useState(false);
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    API.get(`/reports/${id}`).then(r => setReport(r.data)).catch(() => navigate("/dashboard")).finally(() => setLoading(false));
  }, [id]);

  const buildShareText = () => {
    const seen = new Date(report.dateLastSeen).toLocaleDateString("en-ZA");
    return `MISSING CHILD ALERT: ${report.childName} (${report.gender}, ${report.age} years old) was last seen at ${report.lastSeenLocation} on ${seen}. Description: ${report.physicalDescription}. Please share and contact the SAPS on 10111 if you have any information.`;
  };

  const shareUrl = () => `${window.location.origin}/reports/${report.reportId}`;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(`${buildShareText()}\n\n${shareUrl()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  // TikTok has no web share URL, so copy the alert and open TikTok for pasting
  const tiktokShare = () => {
    navigator.clipboard?.writeText(`${buildShareText()}\n\n${shareUrl()}`);
    setTiktokCopied(true);
    setTimeout(() => setTiktokCopied(false), 5000);
    window.open("https://www.tiktok.com/upload", "_blank", "noopener,noreferrer");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Missing Child: ${report.childName}`, text: buildShareText(), url: shareUrl() });
      } catch (e) { /* user cancelled */ }
    } else {
      copyToClipboard();
    }
  };

  const openShare = (network) => {
    const text = encodeURIComponent(buildShareText());
    const url = encodeURIComponent(shareUrl());
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      email: `mailto:?subject=${encodeURIComponent("Missing Child Alert: " + report.childName)}&body=${text}%0A%0A${url}`,
    };
    window.open(links[network], "_blank", "noopener,noreferrer");
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

  if (loading) return <div><Navbar /><div className={styles.loading}>Loading...</div></div>;
  if (!report) return null;

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <button className={styles.back} onClick={() => navigate("/dashboard")}>&larr; Back to Dashboard</button>

        {marked && (
          <div className={styles.successBanner}>
            Thank you! {report.childName} has been marked as found. All community members have been notified.
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.banner} style={{background: report.status === "found" ? "linear-gradient(135deg, #15803d, #16a34a)" : "linear-gradient(135deg, #1a3c6e, #2d6cdf)"}}>
            <span className={styles.badge}>
              {report.status === "found" ? "FOUND" : report.status.toUpperCase()}
            </span>
            <h1>{report.childName}</h1>
            <p>{report.gender} &middot; {report.age} years old &middot; Last seen {new Date(report.dateLastSeen).toLocaleDateString("en-ZA", {day:"numeric",month:"long",year:"numeric"})}</p>
          </div>

          <div className={styles.body}>
            {report.imagePath
              ? <img src={`http://localhost:8080/api/images/${report.imagePath}`} alt={report.childName} className={styles.photo} />
              : <div className={styles.noPhoto}>No photo uploaded</div>
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
                <p>Help find this child &mdash; share this report on social media</p>
                <div className={styles.shareRow}>
                  <button className={`${styles.socialBtn} ${styles.whatsapp}`} onClick={() => openShare("whatsapp")} title="Share on WhatsApp" aria-label="Share on WhatsApp">{Icons.whatsapp}<span>WhatsApp</span></button>
                  <button className={`${styles.socialBtn} ${styles.facebook}`} onClick={() => openShare("facebook")} title="Share on Facebook" aria-label="Share on Facebook">{Icons.facebook}<span>Facebook</span></button>
                  <button className={`${styles.socialBtn} ${styles.twitter}`} onClick={() => openShare("twitter")} title="Share on X (Twitter)" aria-label="Share on X">{Icons.twitter}<span>X</span></button>
                  <button className={`${styles.socialBtn} ${styles.telegram}`} onClick={() => openShare("telegram")} title="Share on Telegram" aria-label="Share on Telegram">{Icons.telegram}<span>Telegram</span></button>
                  <button className={`${styles.socialBtn} ${styles.email}`} onClick={() => openShare("email")} title="Share via Email" aria-label="Share via Email">{Icons.email}<span>Email</span></button>
                  <button className={`${styles.socialBtn} ${styles.tiktok}`} onClick={tiktokShare} title="Copy for TikTok" aria-label="Copy for TikTok">{Icons.tiktok}<span>TikTok</span></button>
                </div>
                {tiktokCopied && <p className={styles.tiktokHint}>Alert copied! Paste it into your TikTok caption or bio after the upload page opens.</p>}
                <div className={styles.shareRow}>
                  <button className={styles.shareBtn} onClick={nativeShare}>More apps&hellip;</button>
                  <button className={styles.copyBtn} onClick={copyToClipboard}>
                    {copied ? "Copied!" : "Copy link & text"}
                  </button>
                </div>
              </div>

              {report.status === "active" && (
                <div className={styles.foundBox}>
                  <p>Did you see this child? Let the community know!</p>
                  <button className={styles.foundBtn} onClick={markAsFound} disabled={marking}>
                    {marking ? "Updating..." : "I Found This Child!"}
                  </button>
                </div>
              )}

              {report.status === "found" && (
                <div className={styles.foundBanner}>
                  This child has been found! Thank you to everyone who helped.
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