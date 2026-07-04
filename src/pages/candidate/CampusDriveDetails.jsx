// src/pages/candidate/CampusDriveDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarClock, ThumbsUp, ThumbsDown } from "lucide-react";
import GlowCard from "../../components/candidate/GlowCard";
import { getCampusDriveById, respondToDrive } from "../../api/campus.api";

const STATUS = {
  upcoming: { bg: "rgba(251,191,36,0.15)", color: "#fcd34d" },
  ongoing: { bg: "rgba(217,70,239,0.15)", color: "#f0abfc" },
  closed: { bg: "rgba(148,163,184,0.15)", color: "#cbd5e1" },
};

const CampusDriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [myResponse, setMyResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  const fetchDrive = async () => {
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
  };

  useEffect(() => {
    fetchDrive();
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

  if (loading) return <p style={{ color: "#a897c9" }}>Loading drive...</p>;
  if (!drive) return <p style={{ color: "#a897c9" }}>Drive not found.</p>;

  const status = STATUS[drive.status] || STATUS.ongoing;
  const isClosed = drive.status === "closed";

  return (
    <div style={{ maxWidth: "700px" }}>
      <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", background: "transparent", color: "#a897c9", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginBottom: "18px", padding: 0 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <GlowCard style={{ padding: "30px" }} hoverLift={false}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>{drive.title}</h1>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#c4b5fd", fontWeight: 600 }}>{drive.company}</p>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "capitalize", color: status.color, background: status.bg, padding: "5px 12px", borderRadius: "999px", flexShrink: 0 }}>{drive.status}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", fontSize: "13px", color: "#a897c9" }}>
          <CalendarClock size={14} /> Respond before {new Date(drive.deadline).toLocaleString()}
        </div>

        {drive.description && <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#e9d5ff", marginBottom: "16px" }}>{drive.description}</p>}
        {drive.jd && <p style={{ fontSize: "13px", color: "#a897c9", marginBottom: "26px" }}>{drive.jd}</p>}

        <div style={{ display: "flex", gap: "10px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isClosed || responding}
            onClick={() => handleRespond("interested")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              border: myResponse === "interested" ? "none" : "1px solid rgba(52,211,153,0.3)",
              borderRadius: "12px", padding: "13px", fontSize: "13.5px", fontWeight: 700,
              color: myResponse === "interested" ? "#fff" : "#6ee7b7",
              background: myResponse === "interested" ? "linear-gradient(to right,#34d399,#10b981)" : "transparent",
              cursor: isClosed ? "not-allowed" : "pointer", opacity: isClosed ? 0.5 : 1,
            }}
          >
            <ThumbsUp size={15} /> Interested
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isClosed || responding}
            onClick={() => handleRespond("not_interested")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              border: myResponse === "not_interested" ? "none" : "1px solid rgba(251,113,133,0.3)",
              borderRadius: "12px", padding: "13px", fontSize: "13.5px", fontWeight: 700,
              color: myResponse === "not_interested" ? "#fff" : "#fda4af",
              background: myResponse === "not_interested" ? "linear-gradient(to right,#fb7185,#f43f5e)" : "transparent",
              cursor: isClosed ? "not-allowed" : "pointer", opacity: isClosed ? 0.5 : 1,
            }}
          >
            <ThumbsDown size={15} /> Not Interested
          </motion.button>
        </div>
      </GlowCard>
    </div>
  );
};

export default CampusDriveDetails;