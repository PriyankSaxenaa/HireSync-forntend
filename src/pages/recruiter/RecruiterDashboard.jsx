import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Briefcase, Users, CheckCircle2, TrendingUp, XCircle, Clock } from "lucide-react";
import { getRecruiterDashboard } from "../../api/analytics.api";

const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div
    style={{
      background: "#131a26",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "20px",
      padding: "22px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    }}
  >
    <div
      style={{
        width: "46px",
        height: "46px",
        borderRadius: "14px",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={20} color="#fff" />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>{value}</p>
      <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>{label}</p>
    </div>
  </div>
);

const FunnelStat = ({ icon: Icon, color, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, display: "inline-block" }} />
    <Icon size={14} color={color} />
    <span style={{ fontSize: "13px", color: "#94a3b8" }}>{label}</span>
    <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{value}</span>
  </div>
);

const RecruiterDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getRecruiterDashboard();
        setAnalytics(data.analytics);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading your dashboard...</p>;
  if (!analytics) return <p style={{ color: "#94a3b8" }}>No data available yet.</p>;

  const { jobsPosted, totalApplications, funnel, acceptanceRate, perJob } = analytics;

  const pendingPct = totalApplications ? (funnel.pending / totalApplications) * 100 : 0;
  const acceptedPct = totalApplications ? (funnel.accepted / totalApplications) * 100 : 0;
  const rejectedPct = totalApplications ? (funnel.rejected / totalApplications) * 100 : 0;

  const maxJobApps = Math.max(1, ...perJob.map((j) => j.applications));

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: "#fff" }}>Welcome back 👋</h1>
        <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#94a3b8" }}>
          Here's how your job postings are performing.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        <StatCard icon={Briefcase} label="Jobs Posted" value={jobsPosted} gradient="linear-gradient(135deg,#f59e0b,#f97316)" />
        <StatCard icon={Users} label="Total Applications" value={totalApplications} gradient="linear-gradient(135deg,#fb7185,#f43f5e)" />
        <StatCard icon={TrendingUp} label="Acceptance Rate" value={`${acceptanceRate}%`} gradient="linear-gradient(135deg,#34d399,#10b981)" />
      </div>

      <div
        style={{
          background: "#131a26",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 18px", fontSize: "16px", fontWeight: 700, color: "#fff" }}>Hiring Funnel</h2>

        {totalApplications === 0 ? (
          <p style={{ color: "#64748b", fontSize: "13px" }}>No applications received yet.</p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "14px",
                borderRadius: "999px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.05)",
                marginBottom: "18px",
              }}
            >
              <div style={{ width: `${pendingPct}%`, background: "#fbbf24" }} />
              <div style={{ width: `${acceptedPct}%`, background: "#34d399" }} />
              <div style={{ width: `${rejectedPct}%`, background: "#fb7185" }} />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
              <FunnelStat icon={Clock} color="#fbbf24" label="Pending" value={funnel.pending} />
              <FunnelStat icon={CheckCircle2} color="#34d399" label="Accepted" value={funnel.accepted} />
              <FunnelStat icon={XCircle} color="#fb7185" label="Rejected" value={funnel.rejected} />
            </div>
          </>
        )}
      </div>

      <div
        style={{
          background: "#131a26",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 18px", fontSize: "16px", fontWeight: 700, color: "#fff" }}>Applications per Job</h2>

        {perJob.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "13px" }}>You haven't posted any jobs yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {perJob.map((j) => (
              <div key={j.jobId}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 600 }}>{j.title}</span>
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>{j.applications}</span>
                </div>
                <div style={{ width: "100%", height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.05)" }}>
                  <div
                    style={{
                      width: `${(j.applications / maxJobApps) * 100}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: "linear-gradient(to right,#f59e0b,#f43f5e)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;