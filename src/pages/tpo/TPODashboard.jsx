// src/pages/tpo/TPODashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  GraduationCap,
  CalendarClock,
  TrendingUp,
  ThumbsUp,
  Upload,
  Plus,
  Users2,
  Sparkles,
  BarChart3,
} from "lucide-react";
import CollegeGateNotice from "../../components/tpo/CollegeGateNotice";
import StatCard from "../../components/fx/StatCard";
import SpotlightCard from "../../components/fx/SpotlightCard";
import PageHeader from "../../components/fx/PageHeader";
import SectionTitle from "../../components/fx/SectionTitle";
import StatusPill from "../../components/fx/StatusPill";
import BarList from "../../components/fx/BarList";
import MagneticButton from "../../components/fx/MagneticButton";
import EmptyState from "../../components/fx/EmptyState";
import Loader from "../../components/fx/Loader";
import { useAuth } from "../../hooks/useAuth";
import { getTpoAnalytics, getStudents, getDrives } from "../../api/tpo.api";

// Human-readable countdown to a drive's deadline, flagged urgent under 2 days.
function timeUntil(deadline) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (Number.isNaN(diff)) return { text: "—", urgent: false };
  if (diff <= 0) return { text: "Closed", urgent: false };

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days < 2 };

  const mins = Math.floor((diff % 3600000) / 60000);
  return { text: `${hours}h ${mins}m left`, urgent: true };
}

const QUICK_ACTIONS = [
  { to: "/tpo/students", label: "Import students", icon: Upload },
  { to: "/tpo/placement-groups", label: "Create group", icon: Users2 },
  { to: "/tpo/drives", label: "Post a drive", icon: Plus },
];

const TPODashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  // null = accessible, "none" = no college registered, "unverified" = registered but not verified
  const [gateStatus, setGateStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [drives, setDrives] = useState([]);
  // Re-render every 30s so the countdowns on recent drives keep ticking down.
  const [, setTick] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [analyticsRes, studentsRes, drivesRes] = await Promise.allSettled([
          getTpoAnalytics(),
          getStudents(),
          getDrives(),
        ]);

        const results = [analyticsRes, studentsRes, drivesRes];
        const allFailed = results.every((r) => r.status === "rejected");

        if (allFailed) {
          const status = results[0].reason?.response?.status;
          setGateStatus(status === 403 ? "unverified" : "none");
          return;
        }

        if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data.analytics);
        if (studentsRes.status === "fulfilled") setStudentCount(studentsRes.value.data.total || 0);
        if (drivesRes.status === "fulfilled") setDrives(drivesRes.value.data.drives || []);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const branchRows = useMemo(() => {
    if (!analytics?.branchBreakdown) return [];
    return Object.entries(analytics.branchBreakdown)
      .sort((a, b) => b[1] - a[1])
      .map(([branch, count]) => ({ branch, count }));
  }, [analytics]);

  const recentDrives = useMemo(() => drives.slice(0, 5), [drives]);

  if (loading) return <Loader label="Loading your placement cell" full />;
  if (gateStatus) return <CollegeGateNotice status={gateStatus} />;

  const firstName = user?.name?.split(" ")[0];

  return (
    <div>
      <PageHeader
        eyebrow="Placement cell overview"
        icon={Sparkles}
        title={firstName ? `Welcome back, ${firstName} 👋` : "Welcome back 👋"}
        liveLabel="SEASON ACTIVE"
        subtitle="Track drives, manage placement groups and keep your students moving toward offers."
        actions={
          <MagneticButton to="/tpo/drives">
            <Plus size={15} /> Post a drive
          </MagneticButton>
        }
      />

      {/* Quick actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "26px" }}>
        {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
          <MagneticButton key={to} to={to} variant="ghost" strength={0.18} style={{ fontSize: "13px" }}>
            <Icon size={15} /> {label}
          </MagneticButton>
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "26px",
        }}
      >
        <StatCard icon={GraduationCap} label="Students onboarded" value={studentCount} tone="var(--hs-a1-rgb)" delay={0} />
        <StatCard
          icon={CalendarClock}
          label="Drives posted"
          value={analytics?.drivesPosted || 0}
          tone="var(--hs-a2-rgb)"
          delay={0.06}
        />
        <StatCard
          icon={ThumbsUp}
          label="Interested responses"
          value={analytics?.interested || 0}
          tone="var(--hs-a3-rgb)"
          delay={0.12}
          live={(analytics?.interested || 0) > 0}
        />
        <StatCard
          icon={TrendingUp}
          label="Interested rate"
          value={analytics?.interestedPercentage || 0}
          suffix="%"
          progress={analytics?.interestedPercentage || 0}
          tone="var(--hs-ok-rgb)"
          delay={0.18}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "18px",
          marginBottom: "18px",
        }}
      >
        {/* Branch breakdown */}
        <SpotlightCard hover={false} padding={24}>
          <SectionTitle title="Interested by branch" subtitle="Where the demand is" icon={BarChart3} />
          <BarList
            items={branchRows}
            valueKey="count"
            labelKey="branch"
            emptyLabel="No responses yet — post a drive to start collecting interest."
          />
        </SpotlightCard>

        {/* Top skills — sized by frequency, a live word cloud */}
        <SpotlightCard hover={false} padding={24}>
          <SectionTitle title="Top skills" subtitle="Among interested candidates" icon={Sparkles} />

          {!analytics?.topSkills?.length ? (
            <p style={{ color: "var(--hs-dim)", fontSize: "13px", margin: 0 }}>
              Skill data will appear once students respond to drives.
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {analytics.topSkills.map((s, i) => (
                <motion.span
                  key={s.skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 20 }}
                  className="hs-chip"
                  style={{
                    fontSize: `${11 + Math.min(s.count, 6)}px`,
                    padding: "6px 14px",
                    animation: `hs-float-sm ${4 + (i % 4)}s var(--hs-ease-in-out) ${i * 0.12}s infinite`,
                  }}
                >
                  {s.skill} · {s.count}
                </motion.span>
              ))}
            </div>
          )}
        </SpotlightCard>
      </div>

      {/* Recent drives */}
      <SpotlightCard hover={false} padding={24}>
        <SectionTitle title="Recent drives" subtitle="With live countdowns" icon={CalendarClock} to="/tpo/drives" />

        {recentDrives.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No drives posted yet"
            subtitle="Publish a drive and your students get notified instantly."
            action={
              <MagneticButton to="/tpo/drives">
                <Plus size={15} /> Post your first drive
              </MagneticButton>
            }
            compact
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentDrives.map((d, i) => {
              const countdown = timeUntil(d.deadline);
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    padding: "14px 16px",
                    borderRadius: "var(--hs-r)",
                    background: "rgba(255,255,255,0.028)",
                    border: "1px solid var(--hs-line)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "var(--hs-text)" }}>{d.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--hs-muted)" }}>{d.company}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: countdown.urgent ? "var(--hs-bad)" : "var(--hs-muted)",
                      }}
                    >
                      {countdown.urgent && <span className="hs-pulse-dot" style={{ width: 6, height: 6 }} />}
                      {countdown.text}
                    </span>
                    <StatusPill status={d.status} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};

export default TPODashboard;
