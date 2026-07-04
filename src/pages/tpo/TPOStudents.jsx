// src/pages/tpo/TPOStudents.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Upload, Search, GraduationCap, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { getStudents, importStudents } from "../../api/tpo.api";
import CollegeGateNotice from "../../components/tpo/CollegeGateNotice";

const TPOStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gateStatus, setGateStatus] = useState(null); // null | "none" | "unverified"
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const fileInputRef = useRef(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await getStudents();
      setStudents(data.students || []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) setGateStatus("unverified");
      else if (status === 404) setGateStatus("none");
      else toast.error(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await importStudents(file);
      setImportSummary(data);
      toast.success(data.message || "Import complete");
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const branches = useMemo(() => {
    const set = new Set(students.map((s) => s.branch).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [students]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchesBranch = branchFilter === "all" || s.branch === branchFilter;
      const matchesSearch =
        !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.rollNo?.toLowerCase().includes(q);
      return matchesBranch && matchesSearch;
    });
  }, [students, search, branchFilter]);

  if (gateStatus) {
    return <CollegeGateNotice status={gateStatus} />;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>Students</h1>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#a897c9" }}>{students.length} students on your campus roster.</p>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 20px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(to right,#8b5cf6,#d946ef)",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.6 : 1,
            boxShadow: "0 0 24px rgba(217,70,239,0.25)",
          }}
        >
          <Upload size={15} />
          {uploading ? "Importing..." : "Import Excel/CSV"}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={16} color="#7c6f93" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or roll no..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px 10px 40px",
              borderRadius: "10px",
              border: "1px solid rgba(216,180,254,0.12)",
              background: "#170f28",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setBranchFilter(b)}
              style={{
                padding: "9px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 600,
                border: "1px solid rgba(216,180,254,0.12)",
                background: branchFilter === b ? "linear-gradient(to right,#8b5cf6,#d946ef)" : "transparent",
                color: "#fff",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#a897c9" }}>Loading students...</p>
      ) : (
        <div style={{ borderRadius: "16px", border: "1px solid rgba(216,180,254,0.1)", overflow: "hidden", background: "#170f28" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(216,180,254,0.08)" }}>
                {["Student", "Roll No", "Branch", "CGPA", "Skills"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "14px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#7c6f93" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#d946ef)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        <GraduationCap size={14} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 600, color: "#fff" }}>{s.name}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#7c6f93" }}>{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "#c4b5fd", fontSize: "13px" }}>{s.rollNo || "—"}</td>
                  <td style={{ padding: "14px 20px", color: "#c4b5fd", fontSize: "13px" }}>{s.branch || "—"}</td>
                  <td style={{ padding: "14px 20px", color: "#c4b5fd", fontSize: "13px" }}>{s.cgpa ?? "—"}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "260px" }}>
                      {(s.skills || []).slice(0, 4).map((sk) => (
                        <span key={sk} style={{ fontSize: "10.5px", fontWeight: 600, color: "#f0abfc", background: "rgba(217,70,239,0.1)", padding: "3px 8px", borderRadius: "999px" }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#544468" }}>
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Import summary modal */}
      <AnimatePresence>
        {importSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImportSummary(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "480px", background: "#1a1030", border: "1px solid rgba(216,180,254,0.15)", borderRadius: "20px", padding: "26px", boxSizing: "border-box" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>Import Summary</h3>
                <button onClick={() => setImportSummary(null)} style={{ border: "none", background: "transparent", color: "#a897c9", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "Total Rows", value: importSummary.summary?.totalRows },
                  { label: "Created", value: importSummary.summary?.created },
                  { label: "Linked", value: importSummary.summary?.linked },
                  { label: "Skipped", value: importSummary.summary?.skipped },
                ].map((s) => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff" }}>{s.value ?? 0}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#a897c9" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: "12px", color: "#a897c9", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <CheckCircle2 size={13} color="#34d399" />
                {importSummary.emails?.sent || 0} credential emails sent
              </p>

              {importSummary.summary?.errors?.length > 0 && (
                <div style={{ maxHeight: "160px", overflowY: "auto", marginTop: "10px" }}>
                  {importSummary.summary.errors.slice(0, 10).map((e, i) => (
                    <p key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#fca5a5", margin: "4px 0" }}>
                      <AlertTriangle size={11} /> Row {e.row}: {e.reason}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TPOStudents;