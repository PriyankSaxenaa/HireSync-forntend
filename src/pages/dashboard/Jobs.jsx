// src/pages/dashboard/Jobs.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, MapPin, Calendar, Briefcase, Building2 } from "lucide-react";
import { getAllJobsAdmin } from "../../api/admin.api";
import SpotlightCard from "../../components/fx/SpotlightCard";
import PageHeader from "../../components/fx/PageHeader";
import SearchField from "../../components/fx/SearchField";
import EmptyState from "../../components/fx/EmptyState";
import Counter from "../../components/fx/Counter";
import { SkeletonGrid } from "../../components/fx/Skeleton";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllJobsAdmin();
        setJobs(data.jobs || []);
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((j) => !q || j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q));
  }, [jobs, search]);

  return (
    <div>
      <PageHeader
        eyebrow="Moderation"
        icon={Briefcase}
        title="All jobs"
        liveLabel={`${jobs.length} LIVE`}
        subtitle={
          <>
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={filtered.length} />
            </b>{" "}
            of {jobs.length} posting{jobs.length === 1 ? "" : "s"} across every recruiter on the platform.
          </>
        }
      >
        <SearchField
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search jobs or companies…"
          flex="1 1 320px"
        />
      </PageHeader>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={jobs.length === 0 ? "No jobs posted yet" : "No jobs match your search"}
          subtitle={
            jobs.length === 0
              ? "Recruiter postings will appear here as soon as they publish."
              : "Try a different keyword."
          }
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {filtered.map((j) => (
            <SpotlightCard key={j._id} padding={20} style={{ height: "100%" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    flexShrink: 0,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    background: "var(--hs-grad-soft)",
                    border: "1px solid var(--hs-line)",
                  }}
                >
                  <Building2 size={17} style={{ color: "var(--hs-a2)" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: "15.5px", fontWeight: 800, color: "var(--hs-text)", lineHeight: 1.3 }}>
                    {j.title}
                  </h3>
                  <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--hs-a2)", fontWeight: 700 }}>
                    {j.company}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "12.5px", color: "var(--hs-muted)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <MapPin size={13} style={{ color: "var(--hs-dim)" }} /> {j.location || "—"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <Calendar size={13} style={{ color: "var(--hs-dim)" }} />
                  {j.applicationDeadline ? new Date(j.applicationDeadline).toLocaleDateString() : "—"}
                </span>
              </div>

              <div
                style={{
                  marginTop: "14px",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--hs-line)",
                  fontSize: "12px",
                  color: "var(--hs-dim)",
                }}
              >
                Posted by{" "}
                <span style={{ color: "var(--hs-text)", fontWeight: 700 }}>{j.recruiter?.name || "Unknown"}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
