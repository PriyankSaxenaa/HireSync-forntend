import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, MapPin, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { getApplicantsForJob, updateApplicationStatus } from "../../api/applications.api";

const STATUS_STYLES = {
  pending: { bg: "rgba(251,191,36,0.15)", color: "#fcd34d", icon: Clock, label: "Pending" },
  accepted: { bg: "rgba(52,211,153,0.15)", color: "#6ee7b7", icon: CheckCircle2, label: "Accepted" },
  rejected: { bg: "rgba(251,113,133,0.15)", color: "#fda4af", icon: XCircle, label: "Rejected" },
};

const initialsOf = (name = "?") =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const { data } = await getApplicantsForJob(jobId);
      setApplications(data.applications || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
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

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading applicants...</p>;

  return (
    <div>
      <button
        onClick={() => navigate("/recruiter/jobs")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "none",
          background: "transparent",
          color: "#94a3b8",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "18px",
          padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Back to My Jobs
      </button>

      <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 800, color: "#fff" }}>Applicants</h1>
      <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#94a3b8" }}>
        {applications.length} candidate{applications.length !== 1 ? "s" : ""} applied to this job.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {applications.map((app) => {
          const status = STATUS_STYLES[app.status] || STATUS_STYLES.pending;
          const StatusIcon = status.icon;
          const candidate = app.candidate || {};

          return (
            <div
              key={app._id}
              style={{
                background: "#131a26",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "18px",
                padding: "20px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#f59e0b,#f43f5e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {initialsOf(candidate.name)}
              </div>

              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff" }}>{candidate.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#94a3b8" }}>{candidate.email}</p>
                {candidate.location && (
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    <MapPin size={11} /> {candidate.location}
                  </span>
                )}
              </div>

              {candidate.skills?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: "1 1 220px" }}>
                  {candidate.skills.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#fdba74",
                        background: "rgba(245,158,11,0.12)",
                        padding: "3px 9px",
                        borderRadius: "999px",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
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
                      fontWeight: 600,
                      color: "#93c5fd",
                      textDecoration: "none",
                      border: "1px solid rgba(147,197,253,0.3)",
                      padding: "7px 12px",
                      borderRadius: "999px",
                    }}
                  >
                    <FileText size={13} /> Resume
                  </a>
                )}

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: status.color,
                    background: status.bg,
                    padding: "6px 12px",
                    borderRadius: "999px",
                  }}
                >
                  <StatusIcon size={12} /> {status.label}
                </span>

                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatus(app._id, "accepted")}
                      disabled={updatingId === app._id}
                      style={{
                        border: "none",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#fff",
                        background: "linear-gradient(to right,#34d399,#10b981)",
                        cursor: updatingId === app._id ? "not-allowed" : "pointer",
                        opacity: updatingId === app._id ? 0.6 : 1,
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatus(app._id, "rejected")}
                      disabled={updatingId === app._id}
                      style={{
                        border: "1px solid rgba(251,113,133,0.4)",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#fda4af",
                        background: "transparent",
                        cursor: updatingId === app._id ? "not-allowed" : "pointer",
                        opacity: updatingId === app._id ? 0.6 : 1,
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {applications.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#475569",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: "18px",
            }}
          >
            No applicants yet for this job.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;