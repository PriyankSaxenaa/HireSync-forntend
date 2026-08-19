// src/pages/recruiter/JobApplicants.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MapPin, FileText, Users, Check, X } from "lucide-react";
import { getApplicantsForJob, updateApplicationStatus } from "../../api/applications.api";
import SpotlightCard from "../../components/fx/SpotlightCard";
import StatusPill from "../../components/fx/StatusPill";
import PageHeader from "../../components/fx/PageHeader";
import EmptyState from "../../components/fx/EmptyState";
import BackLink from "../../components/fx/BackLink";
import Counter from "../../components/fx/Counter";
import Loader from "../../components/fx/Loader";
import { initialsOf } from "../../components/common/UserMenu";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getApplicantsForJob(jobId);
        setApplications(data.applications || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load applicants");
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const handleStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      toast.success(`Application ${status}`);
      setApplications((prev) => prev.map((a) => (a._id === applicationId ? { ...a, status } : a)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    const base = { all: applications.length, pending: 0, accepted: 0, rejected: 0 };
    applications.forEach((a) => {
      if (base[a.status] !== undefined) base[a.status] += 1;
    });
    return base;
  }, [applications]);

  const visible = useMemo(
    () => (filter === "all" ? applications : applications.filter((a) => a.status === filter)),
    [applications, filter]
  );

  if (loading) return <Loader label="Loading applicants" full />;

  const total = applications.length;

  return (
    <div>
      <BackLink to="/recruiter/jobs" label="Back to my jobs" />

      <PageHeader
        eyebrow="Applicant pool"
        icon={Users}
        title="Applicants"
        liveLabel={counts.pending > 0 ? `${counts.pending} TO REVIEW` : "ALL REVIEWED"}
        subtitle={
          <>
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={total} />
            </b>{" "}
            candidate{total === 1 ? "" : "s"} applied to this role.
          </>
        }
      />

      {total > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "7px 15px",
                  borderRadius: "var(--hs-r-full)",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: active ? "var(--hs-a2)" : "var(--hs-muted)",
                  background: active ? "rgba(var(--hs-a2-rgb),0.13)" : "var(--hs-surface)",
                  border: `1px solid ${active ? "rgba(var(--hs-a2-rgb),0.4)" : "var(--hs-line)"}`,
                  transition: "all 0.22s var(--hs-ease)",
                }}
              >
                {f.label}
                <span style={{ fontSize: "11px", opacity: 0.75 }}>{counts[f.key]}</span>
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title={total === 0 ? "No applicants yet" : `No ${filter} applicants`}
          subtitle={
            total === 0
              ? "As soon as someone applies to this role, they'll appear here with their resume and skills."
              : "Try a different status filter."
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {visible.map((app, i) => {
            const candidate = app.candidate || {};
            const pending = app.status === "pending";

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <SpotlightCard hover={false} live={pending} padding={20}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: "#fff",
                        background: "var(--hs-a2)",
                      }}
                    >
                      {initialsOf(candidate.name)}
                    </div>

                    <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "var(--hs-text)" }}>
                        {candidate.name}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--hs-muted)" }}>
                        {candidate.email}
                      </p>
                      {candidate.location && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "11.5px",
                            color: "var(--hs-dim)",
                            marginTop: "5px",
                          }}
                        >
                          <MapPin size={11} /> {candidate.location}
                        </span>
                      )}
                    </div>

                    {candidate.skills?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: "1 1 220px" }}>
                        {candidate.skills.slice(0, 6).map((s) => (
                          <span key={s} className="hs-chip" style={{ fontSize: "10.5px", padding: "3px 10px" }}>
                            {s}
                          </span>
                        ))}
                        {candidate.skills.length > 6 && (
                          <span style={{ fontSize: "11px", color: "var(--hs-dim)", alignSelf: "center" }}>
                            +{candidate.skills.length - 6}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap", flexShrink: 0 }}>
                      {candidate.resumeUrl && (
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "var(--hs-info)",
                            border: "1px solid rgba(var(--hs-info-rgb),0.3)",
                            background: "rgba(var(--hs-info-rgb),0.08)",
                            padding: "8px 14px",
                            borderRadius: "var(--hs-r-full)",
                          }}
                        >
                          <FileText size={13} /> Resume
                        </a>
                      )}

                      <StatusPill status={app.status} size="md" />

                      {pending && (
                        <>
                          <button
                            onClick={() => handleStatus(app._id, "accepted")}
                            disabled={updatingId === app._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              border: "none",
                              borderRadius: "var(--hs-r-full)",
                              padding: "9px 15px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#fff",
                              background: "var(--hs-ok)",
                              cursor: updatingId === app._id ? "not-allowed" : "pointer",
                              opacity: updatingId === app._id ? 0.6 : 1,
                            }}
                          >
                            <Check size={13} /> Accept
                          </button>

                          <button
                            onClick={() => handleStatus(app._id, "rejected")}
                            disabled={updatingId === app._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              border: "1px solid rgba(var(--hs-bad-rgb),0.35)",
                              borderRadius: "var(--hs-r-full)",
                              padding: "9px 15px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "var(--hs-bad)",
                              background: "transparent",
                              cursor: updatingId === app._id ? "not-allowed" : "pointer",
                              opacity: updatingId === app._id ? 0.6 : 1,
                              transition: "background 0.2s var(--hs-ease)",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.13)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <X size={13} /> Reject
                          </button>
                        </>
                      )}
                    </div>
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

export default JobApplicants;
