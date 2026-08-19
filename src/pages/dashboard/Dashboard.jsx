// src/pages/dashboard/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Users, Briefcase, School, ShieldCheck, ShieldHalf, Clock } from "lucide-react";
import { getAllUsers, getAllJobsAdmin } from "../../api/admin.api";
import { getAllColleges } from "../../api/college.api";
import StatCard from "../../components/fx/StatCard";
import SpotlightCard from "../../components/fx/SpotlightCard";
import PageHeader from "../../components/fx/PageHeader";
import SectionTitle from "../../components/fx/SectionTitle";
import BarList from "../../components/fx/BarList";
import FunnelBar from "../../components/fx/FunnelBar";
import ProgressRing from "../../components/fx/ProgressRing";
import Loader from "../../components/fx/Loader";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, colleges: 0, verified: 0 });
  const [roleCounts, setRoleCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, jobsRes, collegesRes] = await Promise.all([
          getAllUsers(),
          getAllJobsAdmin(),
          getAllColleges(),
        ]);

        const users = usersRes.data.users || [];
        const colleges = collegesRes.data.colleges || [];

        setStats({
          users: users.length,
          jobs: jobsRes.data.jobs?.length || 0,
          colleges: colleges.length,
          verified: colleges.filter((c) => c.isVerified).length,
        });

        setRoleCounts(
          users.reduce((acc, u) => {
            if (u.role) acc[u.role] = (acc[u.role] || 0) + 1;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const roleRows = useMemo(
    () =>
      Object.entries(roleCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([role, count]) => ({ role, count })),
    [roleCounts]
  );

  if (loading) return <Loader label="Loading platform overview" full />;

  const pending = stats.colleges - stats.verified;
  const verifiedPct = stats.colleges ? Math.round((stats.verified / stats.colleges) * 100) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Platform control"
        icon={ShieldHalf}
        title="Overview"
        liveLabel="MONITORING"
        subtitle="Everything happening across HireSync — users, postings and campus verification."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "26px",
        }}
      >
        <StatCard icon={Users} label="Total users" value={stats.users} tone="var(--hs-a1-rgb)" delay={0} live />
        <StatCard icon={Briefcase} label="Total jobs" value={stats.jobs} tone="var(--hs-a2-rgb)" delay={0.06} />
        <StatCard icon={School} label="Registered colleges" value={stats.colleges} tone="var(--hs-a3-rgb)" delay={0.12} />
        <StatCard
          icon={ShieldCheck}
          label="Verified colleges"
          value={stats.verified}
          hint={pending > 0 ? `${pending} awaiting review` : "All caught up"}
          progress={verifiedPct}
          tone="var(--hs-ok-rgb)"
          delay={0.18}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        <SpotlightCard hover={false} padding={24}>
          <SectionTitle title="Users by role" subtitle="Who's on the platform" icon={Users} />
          <BarList items={roleRows} valueKey="count" labelKey="role" emptyLabel="No users yet." />
        </SpotlightCard>

        <SpotlightCard hover={false} live={pending > 0} padding={24}>
          <SectionTitle title="College verification" subtitle="Approval backlog" icon={ShieldCheck} />

          <div style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" }}>
            <ProgressRing value={verifiedPct} size={104} stroke={7} label="VERIFIED" />
            <div style={{ flex: "1 1 200px", minWidth: 0 }}>
              <FunnelBar
                total={stats.colleges}
                segments={[
                  { label: "Verified", value: stats.verified, tone: "var(--hs-ok-rgb)", icon: ShieldCheck },
                  { label: "Pending", value: pending, tone: "var(--hs-warn-rgb)", icon: Clock },
                ]}
                emptyLabel="No colleges registered yet."
              />
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Dashboard;
