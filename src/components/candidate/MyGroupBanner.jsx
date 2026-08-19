// src/components/candidate/MyGroupBanner.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users2, Calendar, Info, ArrowRight } from "lucide-react";
import { getMyPlacementGroup } from "../../api/placementGroups.api";
import Modal from "../fx/Modal";

/**
 * Shows which placement group the candidate belongs to. Renders nothing at all
 * for off-campus candidates who aren't in one.
 */
const MyGroupBanner = () => {
  const [group, setGroup] = useState(null);
  const [assignedAt, setAssignedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyPlacementGroup();
        setGroup(data.group || null);
        setAssignedAt(data.group?.assignedAt || null);
      } catch {
        // no group / not on campus — the banner just won't render
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !group) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="hs-card hs-sheen"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          padding: "16px 20px",
          marginBottom: "22px",
          background: "var(--hs-grad-soft)",
          borderColor: "rgba(var(--hs-a2-rgb),0.28)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "13px", position: "relative" }}>
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
            <Users2 size={18} style={{ color: "var(--hs-a3)" }} />
          </div>
          <div>
            <p className="hs-eyebrow" style={{ margin: 0, fontSize: "10px", color: "var(--hs-a2)" }}>
              Your placement group
            </p>
            <p style={{ margin: "3px 0 0", fontSize: "15.5px", fontWeight: 800, color: "var(--hs-text)" }}>
              {group.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="hs-chip"
          style={{
            position: "relative",
            padding: "9px 18px",
            fontSize: "12.5px",
            transition: "gap 0.2s var(--hs-ease)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
          onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
        >
          View group <ArrowRight size={13} />
        </button>
      </motion.div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={group.name}
        subtitle="Placement group"
        icon={Users2}
        width={430}
      >
        {group.description && (
          <p
            style={{
              display: "flex",
              gap: "9px",
              fontSize: "13px",
              color: "var(--hs-text)",
              margin: "0 0 16px",
              lineHeight: 1.65,
            }}
          >
            <Info size={14} style={{ flexShrink: 0, marginTop: "3px", color: "var(--hs-a2)" }} />
            {group.description}
          </p>
        )}

        {assignedAt && (
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12.5px",
              color: "var(--hs-muted)",
              margin: 0,
            }}
          >
            <Calendar size={13} /> Assigned on {new Date(assignedAt).toLocaleDateString()}
          </p>
        )}

        <div
          style={{
            marginTop: "20px",
            padding: "13px 15px",
            borderRadius: "var(--hs-r-sm)",
            background: "rgba(255,255,255,0.035)",
            border: "1px solid var(--hs-line)",
            fontSize: "11.5px",
            lineHeight: 1.6,
            color: "var(--hs-dim)",
          }}
        >
          Your placement cell can post drives targeted at this group — you&apos;ll be notified here the moment
          that happens.
        </div>
      </Modal>
    </>
  );
};

export default MyGroupBanner;
