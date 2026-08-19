// src/pages/candidate/CampusDriveDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { CalendarClock, ThumbsUp, ThumbsDown, Building2, School } from "lucide-react";
import SpotlightCard from "../../components/fx/SpotlightCard";
import StatusPill from "../../components/fx/StatusPill";
import BackLink from "../../components/fx/BackLink";
import Loader from "../../components/fx/Loader";
import EmptyState from "../../components/fx/EmptyState";
import Aurora from "../../components/fx/Aurora";
import { getCampusDriveById, respondToDrive } from "../../api/campus.api";

const CampusDriveDetails = () => {
  const { id } = useParams();
  const [drive, setDrive] = useState(null);
  const [myResponse, setMyResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await getCampusDriveById(id);
        setDrive(data.drive);
        setMyResponse(data.myResponse);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load drive");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleRespond = async (response) => {
    setResponding(true);
    try {
      await respondToDrive(id, response);
      toast.success("Response recorded");
      setMyResponse(response);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to respond");
    } finally {
      setResponding(false);
    }
  };

  if (loading) return <Loader label="Loading drive" full />;

  if (!drive) {
    return (
      <div style={{ maxWidth: "740px" }}>
        <BackLink />
        <EmptyState icon={School} title="Drive not found" subtitle="This drive may have been closed or removed." />
      </div>
    );
  }

  const isClosed = drive.status === "closed";
  const awaiting = !isClosed && !myResponse;

  const respondBtn = (kind, Icon, label, tone) => {
    const chosen = myResponse === kind;
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={isClosed || responding}
        onClick={() => handleRespond(kind)}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          border: chosen ? "1px solid transparent" : `1px solid rgba(${tone},0.32)`,
          borderRadius: "var(--hs-r-full)",
          padding: "14px",
          fontSize: "13.5px",
          fontWeight: 700,
          color: chosen ? "#fff" : `rgb(${tone})`,
          background: chosen ? `rgb(${tone})` : "transparent",
          cursor: isClosed ? "not-allowed" : "pointer",
          opacity: isClosed ? 0.5 : 1,
          transition: "all 0.22s var(--hs-ease)",
        }}
      >
        <Icon size={15} /> {label}
      </motion.button>
    );
  };

  return (
    <div style={{ maxWidth: "780px" }}>
      <BackLink />

      <SpotlightCard hover={false} live={awaiting} padding={0} style={{ overflow: "hidden" }}>
        <div style={{ position: "relative", padding: "28px 30px 22px", overflow: "hidden" }}>
          <Aurora particles={false} grain={false} blobOpacity={0.42} intensity={0.7} />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                flexShrink: 0,
                borderRadius: "var(--hs-r-lg)",
                display: "grid",
                placeItems: "center",
                background: "rgba(var(--hs-a2-rgb),0.14)",
                border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
              }}
            >
              <Building2 size={22} style={{ color: "var(--hs-a3)" }} />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(20px, 2.8vw, 25px)",
                  fontWeight: 900,
                  color: "var(--hs-text)",
                  letterSpacing: "-0.025em",
                }}
              >
                {drive.title}
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--hs-a2)", fontWeight: 700 }}>
                {drive.company}
              </p>
            </div>

            <StatusPill status={drive.status} size="md" />
          </div>
        </div>

        <div style={{ padding: "0 30px 30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "22px",
              padding: "12px 15px",
              borderRadius: "var(--hs-r)",
              fontSize: "13px",
              fontWeight: 600,
              color: awaiting ? "var(--hs-warn)" : "var(--hs-muted)",
              background: awaiting ? "rgba(var(--hs-warn-rgb),0.08)" : "rgba(255,255,255,0.035)",
              border: `1px solid ${awaiting ? "rgba(var(--hs-warn-rgb),0.24)" : "var(--hs-line)"}`,
            }}
          >
            <CalendarClock size={15} />
            Respond before {drive.deadline ? new Date(drive.deadline).toLocaleString() : "—"}
          </div>

          {drive.description && (
            <p style={{ fontSize: "14px", lineHeight: 1.78, color: "var(--hs-text)", marginBottom: "16px" }}>
              {drive.description}
            </p>
          )}

          {drive.jd && (
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.75,
                color: "var(--hs-muted)",
                marginBottom: "26px",
                whiteSpace: "pre-wrap",
              }}
            >
              {drive.jd}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px", paddingTop: "20px", borderTop: "1px solid var(--hs-line)" }}>
            {respondBtn("interested", ThumbsUp, "Interested", "var(--hs-ok-rgb)")}
            {respondBtn("not_interested", ThumbsDown, "Not interested", "var(--hs-bad-rgb)")}
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default CampusDriveDetails;
