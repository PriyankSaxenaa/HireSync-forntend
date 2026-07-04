// src/pages/candidate/MyCampus.jsx
// Standalone page version — use this only if you don't already have a
// candidate dashboard/profile page to drop <CampusStatusCard /> into.
// If you do, just import the card directly wherever it fits.
import CampusStatusCard from "../../components/candidate/CampusStatusCard";

const MyCampus = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#05070f", padding: "40px 24px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 20px", fontSize: "22px", fontWeight: 800, color: "#fff" }}>
          My Campus
        </h1>
        <CampusStatusCard />
      </div>
    </div>
  );
};

export default MyCampus;