// src/pages/candidate/CampusDrives.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { School } from "lucide-react";
import DriveCard from "../../components/candidate/DriveCard";
import EmptyState from "../../components/candidate/EmptyState";
import { getCampusDrives, respondToDrive } from "../../api/campus.api";
import MyGroupBanner from "../../components/candidate/MyGroupBanner";

const CampusDrives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offCampusMessage, setOffCampusMessage] = useState(null);
  const [respondingId, setRespondingId] = useState(null);

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const { data } = await getCampusDrives();
      setDrives(data.drives || []);
      if (data.total === 0 && data.drives?.length === 0 && data.message?.includes("off-campus")) {
        setOffCampusMessage(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load campus drives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleRespond = async (driveId, response) => {
    setRespondingId(driveId);
    try {
      await respondToDrive(driveId, response);
      toast.success("Response recorded");
      setDrives((prev) => prev.map((d) => (d.id === driveId ? { ...d, myResponse: response } : d)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to respond");
    } finally {
      setRespondingId(null);
    }
  };

  if (loading) return <p style={{ color: "#a897c9" }}>Loading campus drives...</p>;

  return (
    <div>
      <div style={{ marginBottom: "22px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>Campus Drives</h1>
        <p style={{ margin: "6px 0 0", fontSize: "13.5px", color: "#a897c9" }}>Drives posted by your college's placement cell.</p>
      </div>

      {/* Only makes sense to show a placement group if the student is actually
          linked to a college — MyGroupBanner also self-guards (renders null
          if there's no group), this just avoids the extra network call. */}
      {!offCampusMessage && <MyGroupBanner />}

      {offCampusMessage ? (
        <EmptyState icon={School} title="No campus linked to your account" subtitle={offCampusMessage} />
      ) : drives.length === 0 ? (
        <EmptyState icon={School} title="No drives posted yet" subtitle="Check back once your placement cell posts a new drive." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "18px" }}>
          {drives.map((d) => (
            <DriveCard
              key={d.id}
              drive={d}
              responding={respondingId === d.id}
              onView={() => navigate(`/candidate/campus/${d.id}`)}
              onRespond={(r) => handleRespond(d.id, r)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusDrives;