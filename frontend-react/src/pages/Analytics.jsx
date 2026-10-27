import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title } from "chart.js";
import styles from "./Analytics.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/analytics/trends").then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div><Navbar /><div className={styles.loading}>Loading analytics...</div></div>;
  if (!data) return null;

  const colors = ["#2d6cdf","#2e7d32","#e65100","#c62828","#7b1fa2","#0097a7","#f57c00","#455a64","#1565c0","#6a1b9a"];

  const barOpts = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Reporting Trends & Analytics</h1>
          <p>Live overview of missing children reports across all locations and time periods</p>
        </div>

        <div className={styles.statsRow}>
          {[
            { label: "Total Reports", value: data.totalReports, color: "#1a3c6e" },
            { label: "Active Cases", value: data.totalActive, color: "#2e7d32" },
            { label: "Children Found", value: data.totalFound, color: "#1565c0" },
            { label: "Duplicates", value: data.totalDuplicate, color: "#e65100" },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statNum} style={{color: s.color}}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.fullChart}>
          <div className={styles.chartCard}>
            <h3>Reports by Month</h3>
            <Bar data={{ labels: Object.keys(data.byMonth), datasets: [{ label: "Reports", data: Object.values(data.byMonth), backgroundColor: "#2d6cdf", borderRadius: 6 }] }} options={barOpts} />
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3>Top Locations</h3>
            <Bar data={{ labels: Object.keys(data.byLocation), datasets: [{ label: "Reports", data: Object.values(data.byLocation), backgroundColor: colors, borderRadius: 4 }] }}
              options={{ ...barOpts, indexAxis: "y" }} />
          </div>
          <div className={styles.chartCard}>
            <h3>Gender Breakdown</h3>
            <Doughnut data={{ labels: Object.keys(data.byGender), datasets: [{ data: Object.values(data.byGender), backgroundColor: ["#2d6cdf","#e91e63","#9c27b0"] }] }} />
          </div>
          <div className={styles.chartCard}>
            <h3>Age Groups</h3>
            <Bar data={{ labels: Object.keys(data.byAgeGroup), datasets: [{ label: "Reports", data: Object.values(data.byAgeGroup), backgroundColor: ["#2e7d32","#1565c0","#e65100","#c62828"], borderRadius: 6 }] }} options={barOpts} />
          </div>
          <div className={styles.chartCard}>
            <h3>Report Status</h3>
            <Pie data={{ labels: ["Active","Found","Duplicate"], datasets: [{ data: [data.totalActive, data.totalFound, data.totalDuplicate], backgroundColor: ["#2d6cdf","#2e7d32","#e65100"] }] }} />
          </div>
        </div>
      </div>
    </div>
  );
}