// src/components/candidate/MyGroupBanner.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users2, X, Calendar, Info } from "lucide-react";
import { getMyPlacementGroup } from "../../api/placementGroups.api";

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
        // no group / not on campus — banner just won't render
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !group) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
          background: "linear-gradient(120deg, rgba(217,70,239,0.12), rgba(139,92,246,0.08))",
          border: "1px solid rgba(217,70,239,0.2)",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "11px",
              background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Users2 size={17} color="#fff" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", color: "#e9b8fa", textTransform: "uppercase" }}>
              Your Placement Group
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "15px", fontWeight: 700, color: "#fff" }}>{group.name}</p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "1px solid rgba(217,70,239,0.35)",
            background: "rgba(217,70,239,0.12)",
            color: "#f0abfc",
            padding: "9px 18px",
            borderRadius: "999px",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          View Group
        </button>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "#1a1030",
                border: "1px solid rgba(217,70,239,0.2)",
                borderRadius: "20px",
                padding: "26px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#8b5cf6,#d946ef)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users2 size={16} color="#fff" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>{group.name}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} style={{ border: "none", background: "transparent", color: "#a897c9", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>

              {group.description && (
                <p style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#e9d5ff", margin: "0 0 14px", lineHeight: 1.5 }}>
                  <Info size={14} style={{ flexShrink: 0, marginTop: "2px" }} color="#c4b5fd" />
                  {group.description}
                </p>
              )}

              {assignedAt && (
                <p style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "#a897c9", margin: 0 }}>
                  <Calendar size={13} /> Assigned on {new Date(assignedAt).toLocaleDateString()}
                </p>
              )}

              <div style={{ marginTop: "20px", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", fontSize: "11.5px", color: "#7c6f93" }}>
                Your TPO can post drives targeted at this group — you'll be notified here whenever that happens.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyGroupBanner;