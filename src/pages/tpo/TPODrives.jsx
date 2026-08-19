// src/pages/tpo/TPODrives.jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  Building2,
  CalendarClock,
  Download,
  ChevronDown,
  Users,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  Link2,
  FileText,
  Target,
} from "lucide-react";
import {
  getDrives,
  createDrive,
  updateDriveStatus,
  getDriveById,
  downloadDriveReport,
} from "../../api/tpo.api";
import { getPlacementGroups } from "../../api/placementGroups.api";
import CollegeGateNotice from "../../components/tpo/CollegeGateNotice";
import PageHeader from "../../components/fx/PageHeader";
import SpotlightCard from "../../components/fx/SpotlightCard";
import EmptyState from "../../components/fx/EmptyState";
import MagneticButton from "../../components/fx/MagneticButton";
import Modal from "../../components/fx/Modal";
import Counter from "../../components/fx/Counter";
import Loader from "../../components/fx/Loader";
import { FormField, Input, TextArea } from "../../components/forms/FormField";

const emptyForm = {
  company: "",
  title: "",
  description: "",
  jd: "",
  targetType: "all",
  targetPlacementGroups: [],
  deadline: "",
};

// Colour the status <select> to match the status it currently shows.
const STATUS_TONE = {
  upcoming: "var(--hs-warn-rgb)",
  ongoing: "var(--hs-a2-rgb)",
  closed: "148,163,184",
};

const TPODrives = () => {
  const [drives, setDrives] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gateStatus, setGateStatus] = useState(null); // null | "none" | "unverified"
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
      const status = err.response?.status;
      if (status === 403) setGateStatus("unverified");
      else if (status === 404) setGateStatus("none");
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

  if (gateStatus) return <CollegeGateNotice status={gateStatus} />;

  const openCount = drives.filter((d) => d.status !== "closed").length;

  const iconBtn = {
    width: "36px",
    height: "36px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    border: "1px solid var(--hs-line)",
    borderRadius: "var(--hs-r-full)",
    background: "transparent",
    color: "var(--hs-muted)",
    transition: "all 0.2s var(--hs-ease)",
  };

  return (
    <div>
      <PageHeader
        eyebrow="Recruitment"
        icon={CalendarClock}
        title="Campus drives"
        liveLabel={openCount > 0 ? `${openCount} OPEN` : "NONE OPEN"}
        subtitle={
          <>
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={drives.length} />
            </b>{" "}
            drive{drives.length === 1 ? "" : "s"} posted. Students are notified the moment you publish.
          </>
        }
        actions={
          <MagneticButton onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Post a drive
          </MagneticButton>
        }
      />

      {loading ? (
        <Loader label="Loading drives" />
      ) : drives.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No drives posted yet"
          subtitle="Post your first drive to reach your students — they get a realtime notification."
          action={
            <MagneticButton onClick={() => setModalOpen(true)}>
              <Plus size={15} /> Post your first drive
            </MagneticButton>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {drives.map((d) => {
            const isExpanded = expandedId === d.id;
            const detail = details[d.id];
            const tone = STATUS_TONE[d.status] || STATUS_TONE.ongoing;

            return (
              <SpotlightCard
                key={d.id}
                hover={false}
                live={d.status === "ongoing"}
                padding={0}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      flexShrink: 0,
                      borderRadius: "var(--hs-r-lg)",
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(var(--hs-a2-rgb),0.14)",
                      border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                    }}
                  >
                    <Building2 size={19} style={{ color: "var(--hs-a3)" }} />
                  </div>

                  <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--hs-text)" }}>{d.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--hs-muted)" }}>{d.company}</p>
                  </div>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "var(--hs-muted)",
                    }}
                  >
                    <CalendarClock size={13} /> {d.deadline ? new Date(d.deadline).toLocaleDateString() : "—"}
                  </span>

                  <select
                    value={d.status}
                    onChange={(e) => handleStatusChange(d.id, e.target.value)}
                    aria-label="Drive status"
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      textTransform: "capitalize",
                      color: `rgb(${tone})`,
                      background: `rgba(${tone},0.12)`,
                      border: `1px solid rgba(${tone},0.3)`,
                      padding: "7px 12px",
                      borderRadius: "var(--hs-r-full)",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="closed">Closed</option>
                  </select>

                  <button
                    onClick={() => handleDownload(d.id, d.company, d.title)}
                    title="Download PDF report"
                    aria-label="Download PDF report"
                    style={iconBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(var(--hs-a2-rgb),0.45)";
                      e.currentTarget.style.color = "var(--hs-a2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--hs-line)";
                      e.currentTarget.style.color = "var(--hs-muted)";
                    }}
                  >
                    <Download size={14} />
                  </button>

                  <button
                    onClick={() => toggleExpand(d.id)}
                    aria-expanded={isExpanded}
                    aria-label="Toggle drive details"
                    style={iconBtn}
                  >
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} style={{ display: "grid" }}>
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden", borderTop: "1px solid var(--hs-line)" }}
                    >
                      <div style={{ padding: "18px 20px" }}>
                        {!detail ? (
                          <Loader label="Loading details" size={40} />
                        ) : (
                          <>
                            {detail.drive?.description && (
                              <p
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.7,
                                  color: "var(--hs-muted)",
                                  margin: "0 0 16px",
                                }}
                              >
                                {detail.drive.description}
                              </p>
                            )}

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                                gap: "10px",
                              }}
                            >
                              {[
                                { icon: Users, label: "Targeted", value: detail.responseSummary?.totalTargeted, tone: "var(--hs-a1-rgb)" },
                                { icon: ThumbsUp, label: "Interested", value: detail.responseSummary?.interested, tone: "var(--hs-ok-rgb)" },
                                { icon: ThumbsDown, label: "Not interested", value: detail.responseSummary?.notInterested, tone: "var(--hs-bad-rgb)" },
                                { icon: MinusCircle, label: "No response", value: detail.responseSummary?.noResponse, tone: "148,163,184" },
                              ].map((s, i) => (
                                <motion.div
                                  key={s.label}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.06 }}
                                  style={{
                                    background: `rgba(${s.tone},0.08)`,
                                    border: `1px solid rgba(${s.tone},0.2)`,
                                    borderRadius: "var(--hs-r)",
                                    padding: "14px 12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <s.icon size={16} style={{ color: `rgb(${s.tone})`, marginBottom: "6px" }} />
                                  <p style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "var(--hs-text)" }}>
                                    <Counter value={s.value ?? 0} />
                                  </p>
                                  <p style={{ margin: 0, fontSize: "10.5px", color: "var(--hs-muted)" }}>{s.label}</p>
                                </motion.div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {/* ── Post a drive ──────────────────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Post a new drive"
        subtitle="Everyone you target gets notified immediately."
        icon={CalendarClock}
        width={580}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 14px" }}>
            <FormField label="Company" icon={Building2} marginBottom={16}>
              <Input name="company" value={form.company} onChange={handleChange} required placeholder="Acme Inc." />
            </FormField>

            <FormField label="Drive title" icon={Target} marginBottom={16}>
              <Input name="title" value={form.title} onChange={handleChange} required placeholder="SDE Campus Drive 2026" />
            </FormField>
          </div>

          <FormField label="Description" icon={FileText} marginBottom={16}>
            <TextArea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Eligibility, rounds, package details…"
            />
          </FormField>

          <FormField label="JD link / notes" icon={Link2} marginBottom={16}>
            <Input name="jd" value={form.jd} onChange={handleChange} placeholder="https://… or free-text notes" />
          </FormField>

          <FormField label="Audience" icon={Users} marginBottom={16}>
            <div style={{ display: "flex", gap: "8px", marginBottom: form.targetType === "placementGroup" ? "12px" : 0, flexWrap: "wrap" }}>
              {[
                { key: "all", label: "All students" },
                { key: "placementGroup", label: "Specific groups" },
              ].map((t) => {
                const active = form.targetType === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, targetType: t.key }))}
                    style={{
                      padding: "9px 17px",
                      borderRadius: "var(--hs-r-full)",
                      fontSize: "12px",
                      fontWeight: 700,
                      border: `1px solid ${active ? "transparent" : "var(--hs-line)"}`,
                      background: active ? "var(--hs-a2)" : "transparent",
                      color: active ? "#fff" : "var(--hs-muted)",
                      transition: "all 0.22s var(--hs-ease)",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {form.targetType === "placementGroup" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {groups.length === 0 && (
                  <p style={{ fontSize: "12px", color: "var(--hs-dim)" }}>
                    No placement groups yet — create one first.
                  </p>
                )}
                {groups.map((g) => {
                  const picked = form.targetPlacementGroups.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGroup(g.id)}
                      aria-pressed={picked}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "var(--hs-r-full)",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        border: `1px solid ${picked ? "rgba(var(--hs-a2-rgb),0.55)" : "var(--hs-line)"}`,
                        background: picked ? "rgba(var(--hs-a2-rgb),0.16)" : "transparent",
                        color: picked ? "var(--hs-a2)" : "var(--hs-muted)",
                        transition: "all 0.2s var(--hs-ease)",
                      }}
                    >
                      {g.name} ({g.studentCount})
                    </button>
                  );
                })}
              </div>
            )}
          </FormField>

          <FormField label="Response deadline" icon={CalendarClock} marginBottom={24}>
            <Input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange} required />
          </FormField>

          <MagneticButton
            type="submit"
            disabled={submitting}
            strength={0.1}
            style={{ width: "100%", padding: "14px", fontSize: "14px" }}
          >
            {submitting ? "Posting…" : "Post drive"}
          </MagneticButton>
        </form>
      </Modal>
    </div>
  );
};

export default TPODrives;
