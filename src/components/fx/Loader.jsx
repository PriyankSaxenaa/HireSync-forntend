// src/components/fx/Loader.jsx

/**
 * Loading state: two counter-rotating accent rings around a breathing core,
 * with the label shimmering underneath. Replaces every bare "Loading..." in
 * the app.
 */
const Loader = ({ label = "Loading", size = 62, full = false }) => {
  const ring = (extra) => ({
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px solid transparent",
    ...extra,
  });

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: full ? "0" : "56px 0",
        minHeight: full ? "60vh" : undefined,
        width: "100%",
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <div
          style={ring({
            borderTopColor: "var(--hs-a2)",
            borderRightColor: "rgba(var(--hs-a2-rgb),0.25)",
            animation: "hs-spin 1.05s linear infinite",
          })}
        />
        <div
          style={ring({
            inset: "9px",
            borderBottomColor: "var(--hs-a3)",
            borderLeftColor: "rgba(var(--hs-a3-rgb),0.25)",
            animation: "hs-spin-rev 1.5s linear infinite",
          })}
        />
        <div
          style={{
            position: "absolute",
            inset: "38%",
            borderRadius: "50%",
            background: "var(--hs-a2)",
          }}
        />
      </div>
      {label && (
        <p className="hs-shimmer-text" style={{ fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.08em" }}>
          {label}
        </p>
      )}
    </div>
  );
};

export default Loader;
