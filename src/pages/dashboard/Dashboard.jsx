// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { Users, Briefcase, School, ShieldCheck } from "lucide-react";
import { getAllUsers, getAllJobsAdmin } from "../../api/admin.api";
import { getAllColleges } from "../../api/college.api";
import StatsCard from "../../components/dashboard/StatsCard";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, colleges: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [usersRes, jobsRes, collegesRes] = await Promise.all([
          getAllUsers(),
          getAllJobsAdmin(),
          getAllColleges(),
        ]);
        const colleges = collegesRes.data.colleges || [];
        setStats({
          users: usersRes.data.users?.length || 0,
          jobs: jobsRes.data.jobs?.length || 0,
          colleges: colleges.length,
          verified: colleges.filter((c) => c.isVerified).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading overview...</p>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      <StatsCard icon={Users} label="Total Users" value={stats.users} color="linear-gradient(135deg,#6366f1,#818cf8)" />
      <StatsCard icon={Briefcase} label="Total Jobs" value={stats.jobs} color="linear-gradient(135deg,#0891b2,#22d3ee)" />
      <StatsCard icon={School} label="Registered Colleges" value={stats.colleges} color="linear-gradient(135deg,#7c3aed,#a78bfa)" />
      <StatsCard icon={ShieldCheck} label="Verified Colleges" value={stats.verified} color="linear-gradient(135deg,#059669,#34d399)" />
    </div>
  );
};

export default Dashboard;