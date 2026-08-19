// src/components/fx/StatusPill.jsx

// Maps every application / drive / verification status the API returns onto a
// semantic colour. Unknown values fall through to a neutral slate pill.
const TONES = {
  applied: ["56,189,248", "Applied"],
  pending: ["251,191,36", "Pending"],
  reviewed: ["168,85,247", "Reviewed"],
  shortlisted: ["52,211,153", "Shortlisted"],
  interview: ["34,211,238", "Interview"],
  accepted: ["52,211,153", "Accepted"],
  approved: ["52,211,153", "Approved"],
  verified: ["52,211,153", "Verified"],
  hired: ["52,211,153", "Hired"],
  active: ["52,211,153", "Active"],
  open: ["52,211,153", "Open"],
  interested: ["52,211,153", "Interested"],
  rejected: ["251,113,133", "Rejected"],
  declined: ["251,113,133", "Declined"],
  closed: ["148,163,184", "Closed"],
  expired: ["148,163,184", "Expired"],
  "not-interested": ["251,113,133", "Not interested"],
};

/**
 * Status chip. Positive states get a pinging dot so an "Active"/"Shortlisted"
 * row keeps a heartbeat going in an otherwise still table.
 */
const StatusPill = ({ status, label, pulse, size = "sm" }) => {
  const key = String(status || "").toLowerCase().trim();
  const [tone, fallbackLabel] = TONES[key] || ["148,163,184", status || "—"];
  const text = label || fallbackLabel;

  const alive =
    pulse ??
    ["shortlisted", "interview", "accepted", "approved", "verified", "hired", "active", "open", "interested"].includes(key);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: size === "sm" ? "4px 10px" : "6px 14px",
        borderRadius: "var(--hs-r-full)",
        fontSize: size === "sm" ? "11px" : "12.5px",
        fontWeight: 700,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
        color: `rgb(${tone})`,
        background: `rgba(${tone},0.12)`,
        border: `1px solid rgba(${tone},0.3)`,
      }}
    >
      {alive ? (
        <span className="hs-pulse-dot" style={{ width: 6, height: 6 }} />
      ) : (
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: 0.7 }} />
      )}
      {text}
    </span>
  );
};

export default StatusPill;
