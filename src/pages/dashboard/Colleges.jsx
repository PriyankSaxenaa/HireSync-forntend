// src/pages/dashboard/Colleges.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, Globe, School, ShieldCheck } from "lucide-react";
import { getAllColleges, verifyCollege } from "../../api/college.api";
import SpotlightCard from "../../components/fx/SpotlightCard";
import PageHeader from "../../components/fx/PageHeader";
import EmptyState from "../../components/fx/EmptyState";
import FilterChips from "../../components/fx/FilterChips";
import Counter from "../../components/fx/Counter";
import { SkeletonGrid } from "../../components/fx/Skeleton";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const { data } = await getAllColleges();
      setColleges(data.colleges || []);
    } catch {
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      await verifyCollege(id);
      toast.success("College verified");
      setColleges((prev) => prev.map((c) => (c._id === id ? { ...c, isVerified: true } : c)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify college");
    } finally {
      setVerifyingId(null);
    }
  };

  const pendingCount = colleges.filter((c) => !c.isVerified).length;

  const options = useMemo(
    () => [
      { key: "all", label: "All", count: colleges.length },
      { key: "pending", label: "Pending", count: pendingCount },
      { key: "verified", label: "Verified", count: colleges.length - pendingCount },
    ],
    [colleges.length, pendingCount]
  );

  const filtered = useMemo(() => {
    if (filter === "pending") return colleges.filter((c) => !c.isVerified);
    if (filter === "verified") return colleges.filter((c) => c.isVerified);
    return colleges;
  }, [colleges, filter]);

  return (
    <div>
      <PageHeader
        eyebrow="Campus governance"
        icon={School}
        title="Colleges"
        liveLabel={pendingCount > 0 ? `${pendingCount} AWAITING REVIEW` : "ALL VERIFIED"}
        subtitle={
          <>
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={colleges.length} />
            </b>{" "}
            college{colleges.length === 1 ? "" : "s"} registered. Verifying one unlocks every placement-cell action
            for its team.
          </>
        }
      />

      <FilterChips
        options={options}
        value={filter}
        onChange={setFilter}
        layoutId="hs-college-filter-pill"
        style={{ marginBottom: "20px" }}
      />

      {loading ? (
        <SkeletonGrid count={3} min={320} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={School}
          title={colleges.length === 0 ? "No colleges registered yet" : `No ${filter} colleges`}
          subtitle={
            colleges.length === 0
              ? "Colleges appear here as soon as a placement officer registers one."
              : "Try a different filter."
          }
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {filtered.map((c) => {
            const verified = Boolean(c.isVerified);
            const tone = verified ? "var(--hs-ok-rgb)" : "var(--hs-warn-rgb)";
            const Icon = verified ? CheckCircle2 : Clock;

            return (
              <SpotlightCard key={c._id} live={!verified} padding={22} style={{ height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        flexShrink: 0,
                        borderRadius: "var(--hs-r)",
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(var(--hs-a2-rgb),0.14)",
                        border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                      }}
                    >
                      <School size={18} style={{ color: "var(--hs-a3)" }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: "15.5px", fontWeight: 800, color: "var(--hs-text)", lineHeight: 1.3 }}>
                      {c.name}
                    </h3>
                  </div>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      color: `rgb(${tone})`,
                      background: `rgba(${tone},0.12)`,
                      border: `1px solid rgba(${tone},0.3)`,
                      padding: "4px 11px",
                      borderRadius: "var(--hs-r-full)",
                    }}
                  >
                    <Icon size={11} /> {verified ? "Verified" : "Pending"}
                  </span>
                </div>

                <div style={{ margin: "16px 0 14px" }}>
                  <p style={{ margin: 0, fontSize: "12.5px", color: "var(--hs-muted)" }}>
                    Placement officer{" "}
                    <span style={{ color: "var(--hs-text)", fontWeight: 700 }}>{c.tpo?.name || "—"}</span>
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--hs-dim)", wordBreak: "break-all" }}>
                    {c.tpo?.email}
                  </p>
                </div>

                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "var(--hs-a2)",
                      marginBottom: "16px",
                    }}
                  >
                    <Globe size={13} /> Visit website
                  </a>
                )}

                {!verified && (
                  <button
                    onClick={() => handleVerify(c._id)}
                    disabled={verifyingId === c._id}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "7px",
                      border: "none",
                      borderRadius: "var(--hs-r-full)",
                      padding: "11px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#fff",
                      background: "var(--hs-a2)",
                      cursor: verifyingId === c._id ? "not-allowed" : "pointer",
                      opacity: verifyingId === c._id ? 0.6 : 1,
                    }}
                  >
                    <ShieldCheck size={14} />
                    {verifyingId === c._id ? "Verifying…" : "Verify college"}
                  </button>
                )}
              </SpotlightCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Colleges;
