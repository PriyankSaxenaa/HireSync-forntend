// src/components/common/NotificationBell.jsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, Inbox } from "lucide-react";

/**
 * Notification bell shared by the candidate and TPO shells.
 *
 * The caller owns fetching — this component only renders. When something is
 * unread the bell rings on a loop and the badge pings, so a new event is
 * visible from across the room.
 */
const NotificationBell = ({ notifications = [], unread = 0, onMarkAllRead, limit = 12 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const hasUnread = unread > 0;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${hasUnread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
        style={{
          position: "relative",
          display: "grid",
          placeItems: "center",
          width: "40px",
          height: "40px",
          borderRadius: "var(--hs-r-full)",
          border: `1px solid ${hasUnread ? "rgba(var(--hs-a2-rgb),0.5)" : "var(--hs-line)"}`,
          background: hasUnread ? "rgba(var(--hs-a2-rgb),0.12)" : "var(--hs-surface)",
          color: hasUnread ? "var(--hs-a2)" : "var(--hs-muted)",
          transition: "all 0.24s var(--hs-ease)",
        }}
      >
        <motion.span
          // A gentle ring-swing that only runs while something is unread.
          animate={hasUnread ? { rotate: [0, -14, 12, -8, 0] } : { rotate: 0 }}
          transition={hasUnread ? { duration: 1.1, repeat: Infinity, repeatDelay: 2.6 } : undefined}
          style={{ display: "grid" }}
        >
          <Bell size={17} />
        </motion.span>

        {hasUnread && (
          <span
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              color: "var(--hs-a3)",
            }}
          >
            <span className="hs-pulse-dot" style={{ width: 8, height: 8 }} />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="hs-card"
            style={{
              position: "absolute",
              top: "calc(100% + 12px)",
              right: 0,
              width: "min(340px, calc(100vw - 32px))",
              maxHeight: "420px",
              overflowY: "auto",
              padding: "10px",
              zIndex: 70,
              transformOrigin: "top right",
              background: "var(--hs-bg-elev)",
              boxShadow: "var(--hs-shadow-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px 12px",
                borderBottom: "1px solid var(--hs-line)",
                marginBottom: "8px",
              }}
            >
              <span className="hs-eyebrow" style={{ fontSize: "10.5px", color: "var(--hs-muted)" }}>
                Notifications
                {hasUnread && (
                  <span
                    style={{
                      padding: "1px 7px",
                      borderRadius: "var(--hs-r-full)",
                      background: "var(--hs-grad)",
                      color: "#fff",
                      fontSize: "9.5px",
                    }}
                  >
                    {unread}
                  </span>
                )}
              </span>

              {hasUnread && onMarkAllRead && (
                <button
                  onClick={onMarkAllRead}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    border: "none",
                    background: "transparent",
                    color: "var(--hs-a2)",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 12px" }}>
                <Inbox size={26} style={{ color: "var(--hs-dim)", marginBottom: "10px" }} />
                <p style={{ margin: 0, fontSize: "12.5px", color: "var(--hs-dim)" }}>You&apos;re all caught up.</p>
              </div>
            ) : (
              notifications.slice(0, limit).map((n, i) => (
                <motion.div
                  key={n._id || i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    position: "relative",
                    padding: "11px 12px",
                    borderRadius: "var(--hs-r-sm)",
                    marginBottom: "3px",
                    background: n.read ? "transparent" : "rgba(var(--hs-a2-rgb),0.09)",
                  }}
                >
                  {!n.read && (
                    <span
                      style={{
                        position: "absolute",
                        left: "4px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "3px",
                        height: "60%",
                        borderRadius: "var(--hs-r-full)",
                        background: "var(--hs-grad)",
                      }}
                    />
                  )}
                  <p style={{ margin: 0, fontSize: "12.5px", lineHeight: 1.5, color: "var(--hs-text)" }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: "10px", color: "var(--hs-dim)" }}>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  </span>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
