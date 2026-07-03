// src/components/dashboard/StatsCard.jsx
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div
    style={{
      background: "#0c1120",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    }}
  >
    <div
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        flexShrink: 0,
      }}
    >
      <Icon size={20} color="#fff" />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#fff" }}>{value}</p>
      <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>{label}</p>
    </div>
  </div>
);

export default StatsCard;