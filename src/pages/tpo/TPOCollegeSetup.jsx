// src/pages/tpo/TPOCollegeSetup.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { School, Globe, MapPin, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { registerCollege, getCollegeById } from "../../api/college.api";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  padding: "12px 16px",
  fontSize: "14px",
  background: "#0e0819",
  color: "#fff",
  border: "1px solid rgba(216,180,254,0.15)",
  outline: "none",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.03em",
  color: "#a897c9",
};

// The backend doesn't expose a "get my college" endpoint for TPOs — the
// college returned right after registration is cached locally so we can show
// a live verification status without asking an admin every time.
const CACHE_KEY = "hiresync_tpo_college";

const TPOCollegeSetup = () => {
  const [form, setForm] = useState({ name: "", address: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [college, setCollege] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setCollege(parsed);
          // refresh verification status in the background
          const { data } = await getCollegeById(parsed._id);
          setCollege(data.college);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.college));
        } catch {
          // stale cache — keep showing what we had
        }
      }
      setChecking(false);
    })();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await registerCollege(form);
      toast.success(data.message || "College registered successfully");
      setCollege(data.college);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.college));
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You have already registered a college. Refresh the dashboard to see its status.");
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) return <p style={{ color: "#a897c9" }}>Checking college status...</p>;

  if (college) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "560px", margin: "0 auto", background: "#170f28", border: "1px solid rgba(216,180,254,0.1)", borderRadius: "24px", padding: "34px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg,#8b5cf6,#d946ef)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <School size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#fff" }}>{college.name}</h1>
            {college.address && (
              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#a897c9", display: "flex", alignItems: "center", gap: "5px" }}>
                <MapPin size={12} /> {college.address}
              </p>
            )}
          </div>
        </div>

        {college.website && (
          <a href={college.website} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#c4b5fd", textDecoration: "none", marginBottom: "20px" }}>
            <Globe size={13} /> {college.website}
          </a>
        )}

        {college.isVerified ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderRadius: "14px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <ShieldCheck size={20} color="#6ee7b7" />
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#6ee7b7" }}>Verified</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#a897c9" }}>Your college is verified — you can post drives freely.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderRadius: "14px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <ShieldAlert size={20} color="#fcd34d" />
            <div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#fcd34d" }}>Awaiting Verification</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#a897c9" }}>An admin needs to verify your college before you can post drives.</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      style={{ maxWidth: "480px", margin: "0 auto", background: "#170f28", border: "1px solid rgba(216,180,254,0.1)", borderRadius: "24px", padding: "34px" }}
    >
      <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg,#8b5cf6,#d946ef)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
        <School size={24} color="#fff" />
      </div>
      <h1 style={{ margin: "0 0 6px", fontSize: "21px", fontWeight: 800, color: "#fff" }}>Register your College</h1>
      <p style={{ margin: "0 0 26px", fontSize: "13px", color: "#a897c9" }}>
        One college per TPO account. It'll need admin verification before you can post drives.
      </p>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>College Name</label>
        <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Address</label>
        <input name="address" value={form.address} onChange={handleChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: "26px" }}>
        <label style={labelStyle}>Website</label>
        <input name="website" value={form.website} onChange={handleChange} placeholder="https://..." style={inputStyle} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: "none", borderRadius: "999px", padding: "13px", fontSize: "14px", fontWeight: 700, color: "#fff", background: "linear-gradient(to right,#8b5cf6,#d946ef)", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1 }}
      >
        {submitting ? "Registering..." : "Register College"} <ArrowRight size={15} />
      </button>
    </motion.form>
  );
};

export default TPOCollegeSetup;