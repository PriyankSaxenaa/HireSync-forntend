// src/pages/recruiter/RecruiterDashboard.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Briefcase, Users, CheckCircle2, TrendingUp, XCircle, Clock, BarChart3, Plus } from "lucide-react";
import StatCard from "../../components/fx/StatCard";
import SpotlightCard from "../../components/fx/SpotlightCard";
import PageHeader from "../../components/fx/PageHeader";
import SectionTitle from "../../components/fx/SectionTitle";
import ProgressRing from "../../components/fx/ProgressRing";
import FunnelBar from "../../components/fx/FunnelBar";
import BarList from "../../components/fx/BarList";
import MagneticButton from "../../components/fx/MagneticButton";
import EmptyState from "../../components/fx/EmptyState";
import Loader from "../../components/fx/Loader";
import { useAuth } from "../../hooks/useAuth";
import { getRecruiterDashboard } from "../../api/analytics.api";

const RecruiterDashboard = () => {
  const { user } = useAuth();
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

  if (loading) return <Loader label="Crunching your numbers" full />;

  if (!analytics) {
    return (
      <div>
        <PageHeader eyebrow="Recruiter" icon={Briefcase} title="Welcome back 👋" live={false} />
        <EmptyState
          icon={BarChart3}
          title="No data available yet"
          subtitle="Post your first role and this dashboard will fill up as applications arrive."
          action={
            <MagneticButton to="/recruiter/jobs">
              <Plus size={15} /> Post a job
            </MagneticButton>
          }
        />
      </div>
    );
  }

  const { jobsPosted, totalApplications, funnel, acceptanceRate, perJob } = analytics;
  const firstName = user?.name?.split(" ")[0];

  const segments = [
    { label: "Pending", value: funnel.pending, tone: "var(--hs-warn-rgb)", icon: Clock },
    { label: "Accepted", value: funnel.accepted, tone: "var(--hs-ok-rgb)", icon: CheckCircle2 },
    { label: "Rejected", value: funnel.rejected, tone: "var(--hs-bad-rgb)", icon: XCircle },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Recruiter"
        icon={Briefcase}
        title={firstName ? `Welcome back, ${firstName} 👋` : "Welcome back 👋"}
        liveLabel="TRACKING"
        subtitle="Here's how your postings are performing right now."
        actions={
          <MagneticButton to="/recruiter/jobs">
            <Plus size={15} /> Post a job
          </MagneticButton>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "26px",
        }}
      >
        <StatCard icon={Briefcase} label="Jobs posted" value={jobsPosted} tone="var(--hs-a1-rgb)" delay={0} />
        <StatCard
          icon={Users}
          label="Total applications"
          value={totalApplications}
          tone="var(--hs-a2-rgb)"
          delay={0.07}
          live={totalApplications > 0}
        />
        <StatCard
          icon={TrendingUp}
          label="Acceptance rate"
          value={acceptanceRate}
          suffix="%"
          progress={acceptanceRate}
          tone="var(--hs-ok-rgb)"
          delay={0.14}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {/* ── Funnel ──────────────────────────────────────────────────────── */}
        <SpotlightCard hover={false} live={totalApplications > 0} padding={24}>
          <SectionTitle title="Hiring funnel" subtitle="Where every application sits" icon={TrendingUp} />

          <div style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" }}>
            <ProgressRing value={acceptanceRate} size={104} stroke={7} label="ACCEPTED" />
            <div style={{ flex: "1 1 220px", minWidth: 0 }}>
              <FunnelBar segments={segments} total={totalApplications} emptyLabel="No applications received yet." />
            </div>
          </div>
        </SpotlightCard>

        {/* ── Per job ─────────────────────────────────────────────────────── */}
        <SpotlightCard hover={false} padding={24}>
          <SectionTitle title="Applications per job" subtitle="Ranked by volume" icon={BarChart3} />
          <BarList
            items={perJob}
            valueKey="applications"
            labelKey="title"
            emptyLabel="You haven't posted any jobs yet."
          />
        </SpotlightCard>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
