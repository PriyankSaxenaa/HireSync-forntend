// src/pages/candidate/MyApplications.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileText, MapPin, Calendar, XCircle, Clock, CheckCircle2, Ban } from "lucide-react";
import GlowCard from "../../components/candidate/GlowCard";
import EmptyState from "../../components/candidate/EmptyState";
import { getMyApplications, withdrawApplication } from "../../api/applications.api";

const STATUS = {
  pending: { bg: "rgba(251,191,36,0.15)", color: "#fcd34d", icon: Clock },
  accepted: { bg: "rgba(52,211,153,0.15)", color: "#6ee7b7", icon: CheckCircle2 },
  rejected: { bg: "rgba(251,113,133,0.15)", color: "#fda4af", icon: XCircle },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

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

  if (loading) return <p style={{ color: "#a897c9" }}>Loading applications...</p>;

  return (
    <div>
      <div style={{ marginBottom: "22px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>My Applications</h1>
        <p style={{ margin: "6px 0 0", fontSize: "13.5px", color: "#a897c9" }}>{applications.length} applications submitted.</p>
      </div>

      {applications.length === 0 ? (
        <EmptyState icon={FileText} title="No applications yet" subtitle="Once you apply to jobs, track their status here." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {applications.map((app) => {
            const status = STATUS[app.status] || STATUS.pending;
            const StatusIcon = status.icon;
            const job = app.job || {};
            return (
              <GlowCard key={app._id} style={{ padding: "18px 20px" }} hoverLift={false}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
                  <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff" }}>{job.title || "Job removed"}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#a897c9" }}>{job.company}</p>
                  </div>

                  <div style={{ display: "flex", gap: "14px", fontSize: "12px", color: "#a897c9" }}>
                    {job.location && <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><MapPin size={12} /> {job.location}</span>}
                    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Calendar size={12} /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>

                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, textTransform: "capitalize", color: status.color, background: status.bg, padding: "6px 12px", borderRadius: "999px" }}>
                    <StatusIcon size={12} /> {app.status}
                  </span>

                  <button
                    onClick={() => handleWithdraw(app._id, job.title)}
                    disabled={withdrawingId === app._id}
                    style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid rgba(251,113,133,0.3)", background: "transparent", color: "#fda4af", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 700, cursor: withdrawingId === app._id ? "not-allowed" : "pointer", opacity: withdrawingId === app._id ? 0.5 : 1 }}
                  >
                    <Ban size={13} /> Withdraw
                  </button>
                </div>
              </GlowCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;