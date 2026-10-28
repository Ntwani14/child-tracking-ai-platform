import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [filterGender, setFilterGender] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  useEffect(() => { loadReports(); }, []);

  useEffect(() => { applyFilters(); }, [reports, search, filterGender, filterStatus, minAge, maxAge]);

  const loadReports = async (query = "") => {
    setLoading(true);
    try {
      const url = query ? `/reports?${searchType}=${encodeURIComponent(query)}` : "/reports";
      const { data } = await API.get(url);
      setReports(data);
    } catch { setReports([]); }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...reports];
    if (filterGender) result = result.filter(r => r.gender === filterGender);
    if (filterStatus) result = result.filter(r => r.status === filterStatus);
    if (minAge) result = result.filter(r => r.age >= parseInt(minAge));
    if (maxAge) result = result.filter(r => r.age <= parseInt(maxAge));
    setFiltered(result);
    setPage(1);
  };

  const handleSearch = () => loadReports(search);
  const handleReset = () => { setSearch(""); loadReports(""); };

  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const statusColor = { active: "#2e7d32", found: "#1565c0", duplicate: "#e65100" };

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
                <div className={styles.statsRow}>
          {[
            { label: "Active Cases", value: reports.filter(r=>r.status==="active").length, color: "#2e7d32", bg: "#f0fdf4", icon: "🔴" },
            { label: "Children Found", value: reports.filter(r=>r.status==="found").length, color: "#1565c0", bg: "#eff6ff", icon: "✅" },
            { label: "Reported Today", value: reports.filter(r=>r.createdAt?.startsWith(new Date().toISOString().split("T")[0])).length, color: "#e65100", bg: "#fff7ed", icon: "📅" },
            { label: "Total Reports", value: reports.length, color: "#1a3c6e", bg: "#f0f5ff", icon: "📋" },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statIcon} style={{background: s.bg}}>{s.icon}</div>
              <div className={styles.statText}>
                <span className={styles.statNum} style={{color: s.color}}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sectionHeader}>
          <h2>Active Missing Children Reports</h2>
          <span className={styles.count}>{filtered.length} report{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading reports...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div style={{fontSize:"3rem",marginBottom:"12px"}}>📋</div>
            <p>No reports found matching your filters.</p>
            <button className={styles.btnPrimary} onClick={() => navigate("/submit")} style={{marginTop:"16px"}}>
              Submit First Report
            </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {paginated.map(r => (
                <div key={r.reportId} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.statusBadge} style={{background: statusColor[r.status]+"22", color: statusColor[r.status]}}>
                      {r.status.toUpperCase()}
                    </span>
                    <span className={styles.date}>{new Date(r.dateLastSeen).toLocaleDateString("en-ZA",{day:"numeric",month:"short",year:"numeric"})}</span>
                  </div>
                  {r.imagePath && (
                    <img src={`http://localhost:8080/api/images/${r.imagePath}`} alt={r.childName} className={styles.cardImg} />
                  )}
                  <div className={styles.cardBody}>
                    <h3 className={styles.childName}>{r.childName}</h3>
                    <div className={styles.details}>
                      <span>👤 {r.gender}, {r.age} years old</span>
                      <span>📍 {r.lastSeenLocation}</span>
                      <span className={styles.desc}>📝 {r.physicalDescription}</span>
                    </div>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.submitter}>By: {r.submittedBy}</span>
                    <button className={styles.btnView} onClick={() => navigate(`/reports/${r.reportId}`)}>
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button disabled={page===1} onClick={() => setPage(p=>p-1)} className={styles.pageBtn}>← Prev</button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className={styles.pageBtn}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}