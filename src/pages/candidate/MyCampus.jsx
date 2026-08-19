// src/pages/candidate/MyCampus.jsx
// Standalone page version — use this only if you don't already have a
// candidate dashboard/profile page to drop <CampusStatusCard /> into.
// If you do, import the card directly wherever it fits.
import { School } from "lucide-react";
import CampusStatusCard from "../../components/candidate/CampusStatusCard";
import PageHeader from "../../components/fx/PageHeader";

const MyCampus = () => (
  <div style={{ maxWidth: "560px", margin: "0 auto" }}>
    <PageHeader
      eyebrow="Campus"
      icon={School}
      title="My campus"
      live={false}
      subtitle="Your college affiliation and placement group."
      compact
    />
    <CampusStatusCard />
  </div>
);

export default MyCampus;
