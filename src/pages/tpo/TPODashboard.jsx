// src/pages/tpo/TPODashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  CalendarClock,
  TrendingUp,
  ThumbsUp,
  Upload,
  Plus,
  Users2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import ColorBends from "../../components/common/ColorBends";
import CollegeGateNotice from "../../components/tpo/CollegeGateNotice";
import { getTpoAnalytics, getStudents, getDrives } from "../../api/tpo.api";

// ── small helpers ────────────────────────────────────────────────────────────

function CountUp({ value = 0, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    let start = null;
    const to = Number(value) || 0;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setDisplay(Math.round(to * progress));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{display}</>;
}

function timeUntil(deadline) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { text: "Closed", urgent: false };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days < 2 };
  const mins = Math.floor((diff % 3600000) / 60000);
  return { text: `${hours}h ${mins}m left`, urgent: true };
}

const STATUS_COLORS = {
  upcoming: { bg: "rgba(251,191,36,0.15)", color: "#fcd34d" },
  ongoing: { bg: "rgba(217,70,239,0.15)", color: "#f0abfc" },
  closed: { bg: "rgba(148,163,184,0.15)", color: "#cbd5e1" },
};

const StatCard = ({ icon: Icon, label, value, gradient, delay = 0, suffix = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -3 }}
    style={{
      background: "#170f28",
      border: "1px solid rgba(216,180,254,0.1)",
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
      <p style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>
        <CountUp value={value} />
        {suffix}
      </p>
      <p style={{ margin: 0, fontSize: "13px", color: "#a897c9" }}>{label}</p>
    </div>
  </motion.div>
);

const TPODashboard = () => {
  const [loading, setLoading] = useState(true);
  // null = accessible, "none" = no college registered, "unverified" = registered but not verified
  const [gateStatus, setGateStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [drives, setDrives] = useState([]);

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
          if (status === 403) setGateStatus("unverified");
          else setGateStatus("none");
          return;
        }

        if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data.analytics);
        if (studentsRes.status === "fulfilled") setStudentCount(studentsRes.value.data.total || 0);
        if (drivesRes.status === "fulfilled") setDrives(drivesRes.value.data.drives || []);
      } catch (err) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const branchRows = useMemo(() => {
    if (!analytics?.branchBreakdown) return [];
    const entries = Object.entries(analytics.branchBreakdown).sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...entries.map(([, v]) => v));
    return entries.map(([branch, count]) => ({ branch, count, pct: (count / max) * 100 }));
  }, [analytics]);

  const recentDrives = useMemo(() => drives.slice(0, 5), [drives]);

  if (loading) {
    return <p style={{ color: "#a897c9" }}>Loading your placement cell...</p>;
  }

  if (gateStatus) {
    return <CollegeGateNotice status={gateStatus} />;
  }

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          position: "relative",
          borderRadius: "28px",
          overflow: "hidden",
          height: "200px",
          marginBottom: "28px",
          border: "1px solid rgba(216,180,254,0.12)",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <ColorBends
            colors={["#8b5cf6", "#d946ef", "#f472b6"]}
            rotation={45}
            speed={0.12}
            scale={1.1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={1.2}
            noise={0.06}
            parallax={0.6}
            iterations={1}
            intensity={1}
            bandWidth={6}
            transparent
          />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(120deg, rgba(10,7,20,0.85), rgba(10,7,20,0.35))",
          }}
        />
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 32px",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#f0abfc", marginBottom: "8px" }}>
            <Sparkles size={14} /> PLACEMENT CELL OVERVIEW
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#fff" }}>
            Welcome back 👋
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#e9d5ff", maxWidth: "480px" }}>
            Track drives, manage placement groups and keep your students moving toward offers.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
        {[
          { to: "/tpo/students", label: "Import Students", icon: Upload },
          { to: "/tpo/placement-groups", label: "Create Group", icon: Users2 },
          { to: "/tpo/drives", label: "Post a Drive", icon: Plus },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 18px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              border: "1px solid rgba(216,180,254,0.18)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <Icon size={15} /> {label}
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "26px" }}>
        <StatCard icon={GraduationCap} label="Students Onboarded" value={studentCount} gradient="linear-gradient(135deg,#8b5cf6,#a78bfa)" delay={0} />
        <StatCard icon={CalendarClock} label="Drives Posted" value={analytics?.drivesPosted || 0} gradient="linear-gradient(135deg,#d946ef,#f472b6)" delay={0.05} />
        <StatCard icon={ThumbsUp} label="Interested Responses" value={analytics?.interested || 0} gradient="linear-gradient(135deg,#06b6d4,#22d3ee)" delay={0.1} />
        <StatCard icon={TrendingUp} label="Interested Rate" value={analytics?.interestedPercentage || 0} suffix="%" gradient="linear-gradient(135deg,#34d399,#10b981)" delay={0.15} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px", marginBottom: "26px" }} className="lg:grid-cols-2">
        {/* Branch breakdown */}
        <div style={{ background: "#170f28", border: "1px solid rgba(216,180,254,0.1)", borderRadius: "20px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 18px", fontSize: "15px", fontWeight: 700, color: "#fff" }}>
            Interested Students by Branch
          </h2>
          {branchRows.length === 0 ? (
            <p style={{ color: "#7c6f93", fontSize: "13px" }}>No responses yet — post a drive to start collecting interest.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {branchRows.map((row, i) => (
                <div key={row.branch}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "#e9d5ff", fontWeight: 600 }}>{row.branch}</span>
                    <span style={{ fontSize: "13px", color: "#a897c9" }}>{row.count}</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.05)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      style={{ height: "100%", borderRadius: "999px", background: "linear-gradient(to right,#8b5cf6,#d946ef)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top skills */}
        <div style={{ background: "#170f28", border: "1px solid rgba(216,180,254,0.1)", borderRadius: "20px", padding: "24px" }}>
          <h2 style={{ margin: "0 0 18px", fontSize: "15px", fontWeight: 700, color: "#fff" }}>
            Top Skills Among Interested Candidates
          </h2>
          {!analytics?.topSkills?.length ? (
            <p style={{ color: "#7c6f93", fontSize: "13px" }}>Skill data will appear once students respond to drives.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {analytics.topSkills.map((s, i) => (
                <motion.span
                  key={s.skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    fontSize: `${11 + Math.min(s.count, 6)}px`,
                    fontWeight: 700,
                    color: "#f0abfc",
                    background: "rgba(217,70,239,0.12)",
                    border: "1px solid rgba(217,70,239,0.2)",
                    padding: "6px 14px",
                    borderRadius: "999px",
                  }}
                >
                  {s.skill} · {s.count}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent drives */}
      <div style={{ background: "#170f28", border: "1px solid rgba(216,180,254,0.1)", borderRadius: "20px", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff" }}>Recent Drives</h2>
          <Link to="/tpo/drives" style={{ fontSize: "12px", fontWeight: 700, color: "#f0abfc", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {recentDrives.length === 0 ? (
          <div style={{ textAlign: "center", padding: "36px 10px" }}>
            <p style={{ margin: "0 0 14px", color: "#7c6f93", fontSize: "13px" }}>No drives posted yet.</p>
            <Link
              to="/tpo/drives"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "999px",
                padding: "9px 18px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(to right,#8b5cf6,#d946ef)",
                textDecoration: "none",
              }}
            >
              <Plus size={14} /> Post your first drive
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentDrives.map((d) => {
              const status = STATUS_COLORS[d.status] || STATUS_COLORS.ongoing;
              const countdown = timeUntil(d.deadline);
              return (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(216,180,254,0.06)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#fff" }}>{d.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#a897c9" }}>{d.company}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: countdown.urgent ? "#fca5a5" : "#a897c9" }}>
                      {countdown.text}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        color: status.color,
                        background: status.bg,
                        padding: "4px 12px",
                        borderRadius: "999px",
                      }}
                    >
                      {d.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TPODashboard;