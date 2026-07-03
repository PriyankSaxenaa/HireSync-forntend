// src/pages/dashboard/Colleges.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, Globe } from "lucide-react";
import { getAllColleges, verifyCollege } from "../../api/college.api";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const { data } = await getAllColleges();
      setColleges(data.colleges || []);
    } catch {
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      await verifyCollege(id);
      toast.success("College verified");
      setColleges((prev) => prev.map((c) => (c._id === id ? { ...c, isVerified: true } : c)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify college");
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading colleges...</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
      {colleges.map((c) => (
        <div
          key={c._id}
          style={{
            background: "#0c1120",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#fff" }}>{c.name}</h3>
            {c.isVerified ? (
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#6ee7b7", background: "rgba(16,185,129,0.15)", padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                <CheckCircle2 size={12} /> Verified
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#fcd34d", background: "rgba(245,158,11,0.15)", padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>
                <Clock size={12} /> Pending
              </span>
            )}
          </div>

          <p style={{ margin: "10px 0 4px", fontSize: "13px", color: "#94a3b8" }}>
            TPO: <span style={{ color: "#cbd5e1", fontWeight: 600 }}>{c.tpo?.name}</span>
          </p>
          <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#64748b" }}>{c.tpo?.email}</p>

          {c.website && (
            <a
              href={c.website}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#818cf8", textDecoration: "none", marginBottom: "16px" }}
            >
              <Globe size={13} /> Visit website
            </a>
          )}

          {!c.isVerified && (
            <button
              onClick={() => handleVerify(c._id)}
              disabled={verifyingId === c._id}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(to right,#6366f1,#22d3ee)",
                cursor: verifyingId === c._id ? "not-allowed" : "pointer",
                opacity: verifyingId === c._id ? 0.6 : 1,
              }}
            >
              {verifyingId === c._id ? "Verifying..." : "Verify College"}
            </button>
          )}
        </div>
      ))}
      {colleges.length === 0 && (
        <p style={{ color: "#475569", gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
          No colleges registered yet.
        </p>
      )}
    </div>
  );
};

export default Colleges;