// src/pages/tpo/TPODrives.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Building2,
  CalendarClock,
  Download,
  ChevronDown,
  ArrowRight,
  Users,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
} from "lucide-react";
import {
  getDrives,
  createDrive,
  updateDriveStatus,
  getDriveById,
  downloadDriveReport,
} from "../../api/tpo.api";
import { getPlacementGroups } from "../../api/placementGroups.api";

const STATUS_COLORS = {
  upcoming: { bg: "rgba(251,191,36,0.15)", color: "#fcd34d" },
  ongoing: { bg: "rgba(217,70,239,0.15)", color: "#f0abfc" },
  closed: { bg: "rgba(148,163,184,0.15)", color: "#cbd5e1" },
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  padding: "11px 14px",
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

const emptyForm = {
  company: "",
  title: "",
  description: "",
  jd: "",
  targetType: "all",
  targetPlacementGroups: [],
  deadline: "",
};

const TPODrives = () => {
  const [drives, setDrives] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noCollege, setNoCollege] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [drivesRes, groupsRes] = await Promise.all([getDrives(), getPlacementGroups()]);
      setDrives(drivesRes.data.drives || []);
      setGroups(groupsRes.data.groups || []);
    } catch (err) {
      if (err.response?.status === 404) setNoCollege(true);
      else toast.error(err.response?.data?.message || "Failed to load drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleGroup = (id) => {
    setForm((f) => ({
      ...f,
      targetPlacementGroups: f.targetPlacementGroups.includes(id)
        ? f.targetPlacementGroups.filter((g) => g !== id)
        : [...f.targetPlacementGroups, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.targetType === "placementGroup" && form.targetPlacementGroups.length === 0) {
      toast.error("Select at least one placement group");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await createDrive(form);
      toast.success(`${data.message} · ${data.notifiedStudents} students notified`);
      setModalOpen(false);
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post drive");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateDriveStatus(id, status);
      setDrives((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
      toast.success(`Drive marked ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!details[id]) {
      try {
        const { data } = await getDriveById(id);
        setDetails((prev) => ({ ...prev, [id]: data }));
      } catch {
        toast.error("Failed to load drive details");
      }
    }
  };

  const handleDownload = async (id, company, title) => {
    try {
      const res = await downloadDriveReport(id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `drive-report-${company}-${title}.pdf`.replace(/[^a-z0-9.-]+/gi, "_"));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download report");
    }
  };

  if (noCollege) {
    return (
      <div style={{ background: "#170f28", border: "1px dashed rgba(216,180,254,0.25)", borderRadius: "24px", padding: "60px 30px", textAlign: "center" }}>
        <p style={{ margin: "0 0 18px", color: "#a897c9", fontSize: "14px" }}>Register and get your college verified before posting drives.</p>
        <Link to="/tpo/college" style={{ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "999px", padding: "12px 24px", fontSize: "13px", fontWeight: 700, color: "#fff", background: "linear-gradient(to right,#8b5cf6,#d946ef)", textDecoration: "none" }}>
          Go to College Setup <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>Campus Drives</h1>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#a897c9" }}>{drives.length} drives posted so far.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            borderRadius: "999px",
            padding: "12px 22px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(to right,#8b5cf6,#d946ef)",
            cursor: "pointer",
            boxShadow: "0 0 24px rgba(217,70,239,0.3)",
          }}
        >
          <Plus size={16} /> Post a Drive
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#a897c9" }}>Loading drives...</p>
      ) : drives.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#544468", border: "1px dashed rgba(216,180,254,0.15)", borderRadius: "20px" }}>
          No drives posted yet. Post your first one to reach your students.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {drives.map((d) => {
            const status = STATUS_COLORS[d.status] || STATUS_COLORS.ongoing;
            const isExpanded = expandedId === d.id;
            const detail = details[d.id];
            return (
              <div key={d.id} style={{ background: "#170f28", border: "1px solid rgba(216,180,254,0.1)", borderRadius: "18px", overflow: "hidden" }}>
                <div style={{ padding: "20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg,#8b5cf6,#d946ef)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Building2 size={18} color="#fff" />
                  </div>
                  <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff" }}>{d.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#a897c9" }}>{d.company}</p>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#a897c9" }}>
                    <CalendarClock size={13} /> {new Date(d.deadline).toLocaleDateString()}
                  </span>
                  <select
                    value={d.status}
                    onChange={(e) => handleStatusChange(d.id, e.target.value)}
                    style={{ fontSize: "11px", fontWeight: 700, textTransform: "capitalize", color: status.color, background: status.bg, border: "none", padding: "6px 10px", borderRadius: "999px", cursor: "pointer" }}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => handleDownload(d.id, d.company, d.title)}
                    title="Download PDF report"
                    style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,180,254,0.15)", borderRadius: "10px", background: "transparent", color: "#e9d5ff", cursor: "pointer" }}
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => toggleExpand(d.id)}
                    style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,180,254,0.15)", borderRadius: "10px", background: "transparent", color: "#e9d5ff", cursor: "pointer" }}
                  >
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden", borderTop: "1px solid rgba(216,180,254,0.08)" }}
                    >
                      <div style={{ padding: "18px 20px" }}>
                        {!detail ? (
                          <p style={{ color: "#7c6f93", fontSize: "12px" }}>Loading details...</p>
                        ) : (
                          <>
                            {detail.drive?.description && (
                              <p style={{ fontSize: "13px", color: "#e9d5ff", margin: "0 0 14px" }}>{detail.drive.description}</p>
                            )}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
                              {[
                                { icon: Users, label: "Targeted", value: detail.responseSummary?.totalTargeted, color: "#a78bfa" },
                                { icon: ThumbsUp, label: "Interested", value: detail.responseSummary?.interested, color: "#34d399" },
                                { icon: ThumbsDown, label: "Not Interested", value: detail.responseSummary?.notInterested, color: "#fb7185" },
                                { icon: MinusCircle, label: "No Response", value: detail.responseSummary?.noResponse, color: "#94a3b8" },
                              ].map((s) => (
                                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "12px", textAlign: "center" }}>
                                  <s.icon size={15} color={s.color} style={{ marginBottom: "4px" }} />
                                  <p style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>{s.value ?? 0}</p>
                                  <p style={{ margin: 0, fontSize: "10.5px", color: "#a897c9" }}>{s.label}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Create drive modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 }}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              style={{ width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", background: "#1a1030", border: "1px solid rgba(216,180,254,0.15)", borderRadius: "20px", padding: "28px", boxSizing: "border-box" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
                <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "#fff" }}>Post a New Drive</h2>
                <button type="button" onClick={() => setModalOpen(false)} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,180,254,0.15)", borderRadius: "999px", background: "transparent", color: "#fff", cursor: "pointer" }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input name="company" value={form.company} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Drive Title</label>
                  <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Job Description Link / Notes</label>
                <input name="jd" value={form.jd} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Audience</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  {["all", "placementGroup"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, targetType: t }))}
                      style={{
                        padding: "9px 16px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: "1px solid rgba(216,180,254,0.15)",
                        background: form.targetType === t ? "linear-gradient(to right,#8b5cf6,#d946ef)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {t === "all" ? "All Students" : "Specific Placement Groups"}
                    </button>
                  ))}
                </div>

                {form.targetType === "placementGroup" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {groups.length === 0 && <p style={{ fontSize: "12px", color: "#7c6f93" }}>No placement groups yet — create one first.</p>}
                    {groups.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGroup(g.id)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: "999px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          border: "1px solid rgba(216,180,254,0.15)",
                          background: form.targetPlacementGroups.includes(g.id) ? "rgba(217,70,239,0.2)" : "transparent",
                          color: form.targetPlacementGroups.includes(g.id) ? "#f0abfc" : "#a897c9",
                          cursor: "pointer",
                        }}
                      >
                        {g.name} ({g.studentCount})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Response Deadline</label>
                <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} required style={inputStyle} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "999px",
                  padding: "13px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                  background: "linear-gradient(to right,#8b5cf6,#d946ef)",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Posting..." : "Post Drive"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TPODrives;