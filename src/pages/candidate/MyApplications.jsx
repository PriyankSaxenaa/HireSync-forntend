// src/pages/candidate/MyApplications.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FileText, MapPin, Calendar, Ban, Building2 } from "lucide-react";
import SpotlightCard from "../../components/fx/SpotlightCard";
import StatusPill from "../../components/fx/StatusPill";
import EmptyState from "../../components/fx/EmptyState";
import PageHeader from "../../components/fx/PageHeader";
import MagneticButton from "../../components/fx/MagneticButton";
import Loader from "../../components/fx/Loader";
import Counter from "../../components/fx/Counter";
import { getMyApplications, withdrawApplication } from "../../api/applications.api";

// Tone per status so the funnel strip and each row agree on colour.
const FUNNEL = [
  { key: "pending", label: "Pending", tone: "var(--hs-warn-rgb)" },
  { key: "accepted", label: "Accepted", tone: "var(--hs-ok-rgb)" },
  { key: "rejected", label: "Rejected", tone: "var(--hs-bad-rgb)" },
];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await getMyApplications();
      setApplications(data.applications || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id, title) => {
    if (!window.confirm(`Withdraw your application for "${title}"?`)) return;
    setWithdrawingId(id);
    try {
      await withdrawApplication(id);
      toast.success("Application withdrawn");
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to withdraw");
    } finally {
      setWithdrawingId(null);
    }
  };

  const counts = useMemo(() => {
    const base = { pending: 0, accepted: 0, rejected: 0 };
    applications.forEach((a) => {
      if (base[a.status] !== undefined) base[a.status] += 1;
    });
    return base;
  }, [applications]);

  const visible = useMemo(
    () => (filter === "all" ? applications : applications.filter((a) => a.status === filter)),
    [applications, filter]
  );

  if (loading) return <Loader label="Loading your applications" full />;

  const total = applications.length;

  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        icon={FileText}
        title="My applications"
        liveLabel="TRACKING"
        subtitle={
          <>
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={total} />
            </b>{" "}
            application{total === 1 ? "" : "s"} submitted. Status updates arrive here in realtime.
          </>
        }
      >
        {/* Funnel strip — each segment's width tracks its share of the total */}
        {total > 0 && (
          <div style={{ display: "flex", gap: "3px", height: "8px", borderRadius: "var(--hs-r-full)", overflow: "hidden" }}>
            {FUNNEL.map((f) => {
              const pct = (counts[f.key] / total) * 100;
              if (!pct) return null;
              return (
                <motion.div
                  key={f.key}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  title={`${f.label}: ${counts[f.key]}`}
                  className="hs-sheen"
                  style={{ background: `rgb(${f.tone})`, borderRadius: "var(--hs-r-full)" }}
                />
              );
            })}
          </div>
        )}
      </PageHeader>

      {/* Status filter chips */}
      {total > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {[{ key: "all", label: "All", count: total, tone: "var(--hs-a2-rgb)" }, ...FUNNEL.map((f) => ({ ...f, count: counts[f.key] }))].map(
            (chip) => {
              const active = filter === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "7px 15px",
                    borderRadius: "var(--hs-r-full)",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: active ? `rgb(${chip.tone})` : "var(--hs-muted)",
                    background: active ? `rgba(${chip.tone},0.13)` : "var(--hs-surface)",
                    border: `1px solid ${active ? `rgba(${chip.tone},0.4)` : "var(--hs-line)"}`,
                    transition: "all 0.22s var(--hs-ease)",
                  }}
                >
                  {chip.label}
                  <span style={{ fontSize: "11px", opacity: 0.75 }}>{chip.count}</span>
                </button>
              );
            }
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={total === 0 ? "No applications yet" : `No ${filter} applications`}
          subtitle={
            total === 0
              ? "Once you apply to a role, its full timeline shows up here."
              : "Try a different status filter."
          }
          action={total === 0 ? <MagneticButton to="/candidate/jobs">Find a role</MagneticButton> : undefined}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {visible.map((app, i) => {
            const job = app.job || {};
            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <SpotlightCard hover={false} padding={18} live={app.status === "accepted"}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        flexShrink: 0,
                        borderRadius: "13px",
                        display: "grid",
                        placeItems: "center",
                        background: "var(--hs-grad-soft)",
                        border: "1px solid var(--hs-line)",
                      }}
                    >
                      <Building2 size={18} style={{ color: "var(--hs-a2)" }} />
                    </div>

                    <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--hs-text)" }}>
                        {job.title || "Job removed"}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--hs-muted)" }}>
                        {job.company}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "14px", fontSize: "12px", color: "var(--hs-muted)", flexWrap: "wrap" }}>
                      {job.location && (
                        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <MapPin size={12} /> {job.location}
                        </span>
                      )}
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Calendar size={12} /> {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "—"}
                      </span>
                    </div>

                    <StatusPill status={app.status} size="md" />

                    <button
                      onClick={() => handleWithdraw(app._id, job.title)}
                      disabled={withdrawingId === app._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid rgba(var(--hs-bad-rgb),0.28)",
                        background: "transparent",
                        color: "var(--hs-bad)",
                        padding: "8px 15px",
                        borderRadius: "var(--hs-r-full)",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: withdrawingId === app._id ? "not-allowed" : "pointer",
                        opacity: withdrawingId === app._id ? 0.5 : 1,
                        transition: "background 0.2s var(--hs-ease)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.13)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Ban size={13} /> Withdraw
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
