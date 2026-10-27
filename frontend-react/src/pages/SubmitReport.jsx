import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import styles from "./SubmitReport.module.css";

export default function SubmitReport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ childName:"", age:"", gender:"", physicalDescription:"", lastSeenLocation:"", dateLastSeen:"" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      let imagePath = null;
      if (photo) {
        const fd = new FormData();
        fd.append("file", photo);
        const { data } = await API.post("/images/upload", fd);
        imagePath = data.filename;
      }
      const { data } = await API.post("/reports", { ...form, age: parseInt(form.age), imagePath });
      setSuccess(`Report submitted for ${data.childName}. ID: ${data.reportId}`);
      setTimeout(() => navigate("/"), 2000);
    } catch(err) {
      setError(err.response?.data?.error || "Failed to submit report.");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <h1>Report a Missing Child</h1>
          <p>Please fill in as much detail as possible. All fields marked * are required.</p>
        </div>
        <div className={styles.card}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
          <form onSubmit={handleSubmit}>
            <h3 className={styles.section}>Child Information</h3>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Full Name *</label>
                <input required placeholder="Child's full name" value={form.childName} onChange={e=>setForm({...form,childName:e.target.value})} />
              </div>
              <div className={styles.field}>
                <label>Age *</label>
                <input required type="number" min="0" max="18" placeholder="Age" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Gender *</label>
                <select required value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Date Last Seen *</label>
                <input required type="date" max={today} value={form.dateLastSeen} onChange={e=>setForm({...form,dateLastSeen:e.target.value})} />
              </div>
            </div>
            <div className={styles.field}>
              <label>Physical Description *</label>
              <textarea required rows={3} placeholder="Describe clothing, height, skin tone, hair, distinguishing features..." value={form.physicalDescription} onChange={e=>setForm({...form,physicalDescription:e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Last Known Location *</label>
              <input required placeholder="e.g. Soshanguve Block H, near the school" value={form.lastSeenLocation} onChange={e=>setForm({...form,lastSeenLocation:e.target.value})} />
            </div>
            <div className={styles.field}>
              <label>Photo <span className={styles.optional}>(optional — JPG or PNG, max 5MB)</span></label>
              <input type="file" accept="image/jpeg,image/png" onChange={handlePhoto} className={styles.fileInput} />
              {preview && <img src={preview} alt="Preview" className={styles.preview} />}
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.btnCancel} onClick={()=>navigate("/")}>Cancel</button>
              <button type="submit" className={styles.btnSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}