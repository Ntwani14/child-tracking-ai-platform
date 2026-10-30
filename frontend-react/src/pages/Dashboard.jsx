import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
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

  useEffect(() => {
    const onFocus = () => loadReports();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => { applyFilters(); }, [allReports, filterGender, filterStatus, minAge, maxAge]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/reports/all");
      setAllReports(data);
    } catch { setAllReports([]); }
    setLoading(false);
  };

  const applyFilters = () => {
    let result = [...allReports];
    if (search.trim()) {
      const q = search.toLowerCase();
      if (searchType === "name") result = result.filter(r => r.childName.toLowerCase().includes(q));
      else result = result.filter(r => r.lastSeenLocation.toLowerCase().includes(q));
    }
    if (filterGender) result = result.filter(r => r.gender === filterGender);
    if (filterStatus) result = result.filter(r => r.status === filterStatus);
    if (minAge) result = result.filter(r => r.age >= parseInt(minAge));
    if (maxAge) result = result.filter(r => r.age <= parseInt(maxAge));
    setFiltered(result);
    setPage(1);
  };

  const handleSearch = () => applyFilters();
  const handleReset = () => { setSearch(""); setFilterGender(""); setFilterStatus("active"); setMinAge(""); setMaxAge(""); };

  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const foundReports = allReports.filter(r => r.status === "found").slice(0, 3);
  const statusColor = { active: "#2e7d32", found: "#1565c0", duplicate: "#e65100" };

  return (
    <div>
      <Navbar />
      <div className={styles.page}>

        <div className={styles.statsRow}>
          {[
            { label: "Active Cases", value: allReports.filter(r=>r.status==="active").length, color: "#2e7d32", bg: "#f0fdf4", icon: "\u{1F6A8}" },
            { label: "Children Found", value: allReports.filter(r=>r.status==="found").length, color: "#1565c0", bg: "#eff6ff", icon: "\u2705" },
            { label: "Reported Today", value: allReports.filter(r=>r.createdAt?.startsWith(new Date().toISOString().split("T")[0])).length, color: "#e65100", bg: "#fff7ed", icon: "\u{1F4C5}" },
            { label: "Total Reports", value: allReports.length, color: "#1a3c6e", bg: "#f0f5ff", icon: "\u{1F4CB}" },
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

        <div className={styles.searchSection}>
          <div className={styles.searchRow}>
            <input className={styles.searchInput} placeholder="Search reports..." value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()} />
            <select className={styles.select} value={searchType} onChange={e => setSearchType(e.target.value)}>
              <option value="name">By Name</option>
              <option value="location">By Location</option>
            </select>
            <button className={styles.btnPrimary} onClick={handleSearch}>Search</button>
            <button className={styles.btnOutline} onClick={handleReset}>Reset</button>
          </div>
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Filters:</span>
            <select className={styles.select} value={filterGender} onChange={e => setFilterGender(e.target.value)}>
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select className={styles.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="active">Active Only</option>
              <option value="">All Statuses</option>
              <option value="found">Found</option>
              <option value="duplicate">Duplicate</option>
            </select>
            <input className={styles.ageInput} type="number" placeholder="Min age" min="0" max="18"
              value={minAge} onChange={e => setMinAge(e.target.value)} />
            <input className={styles.ageInput} type="number" placeholder="Max age" min="0" max="18"
              value={maxAge} onChange={e => setMaxAge(e.target.value)} />
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <h2>{filterStatus === "active" ? "Active Missing Children Reports" : "Missing Children Reports"}</h2>
          <span className={styles.count}>{filtered.length} report{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading reports...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div style={{fontSize:"3rem",marginBottom:"12px"}}>{"\u{1F4CB}"}</div>
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
                      <span>{"\u{1F464}"} {r.gender}, {r.age} years old</span>
                      <span>{"\u{1F4CD}"} {r.lastSeenLocation}</span>
                      <span className={styles.desc}>{"\u{1F4DD}"} {r.physicalDescription}</span>
                    </div>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.submitter}>By: {r.submittedBy}</span>
                    <button className={styles.btnView} onClick={() => navigate(`/reports/${r.reportId}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button disabled={page===1} onClick={() => setPage(p=>p-1)} className={styles.pageBtn}>Prev</button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className={styles.pageBtn}>Next</button>
              </div>
            )}
          </>
        )}

        {foundReports.length > 0 && (
          <div className={styles.foundSection}>
            <div className={styles.foundHeader}>
              <div className={styles.foundTitle}>
                <span className={styles.foundIcon}>{"\u{1F389}"}</span>
                <div>
                  <h2>Recently Found</h2>
                  <p>These children were reported missing and have been safely located.</p>
                </div>
              </div>
              <button className={styles.btnOutline} onClick={() => setFilterStatus("found")}>
                View All Found
              </button>
            </div>
            <div className={styles.foundGrid}>
              {foundReports.map(r => (
                <div key={r.reportId} className={styles.foundCard}>
                  <div className={styles.foundBadge}>{"\u2713"} FOUND</div>
                  {r.imagePath && (
                    <img src={`http://localhost:8080/api/images/${r.imagePath}`} alt={r.childName} className={styles.foundImg} />
                  )}
                  <div className={styles.foundInfo}>
                    <div className={styles.foundName}>{r.childName}</div>
                    <div className={styles.foundDetail}>{r.gender} - {r.age} years - {r.lastSeenLocation}</div>
                  </div>
                  <button className={styles.foundBtn} onClick={() => navigate(`/reports/${r.reportId}`)}>
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}