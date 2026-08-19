// src/pages/candidate/CampusDrives.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { School } from "lucide-react";
import DriveCard from "../../components/candidate/DriveCard";
import MyGroupBanner from "../../components/candidate/MyGroupBanner";
import EmptyState from "../../components/fx/EmptyState";
import PageHeader from "../../components/fx/PageHeader";
import { SkeletonGrid } from "../../components/fx/Skeleton";
import { getCampusDrives, respondToDrive } from "../../api/campus.api";

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

  const awaiting = drives.filter((d) => d.status !== "closed" && !d.myResponse).length;

  return (
    <div>
      <PageHeader
        eyebrow="Campus"
        icon={School}
        title="Campus drives"
        liveLabel={awaiting > 0 ? `${awaiting} AWAITING YOU` : "UP TO DATE"}
        subtitle="Drives posted by your college's placement cell. Respond before the deadline to stay in the running."
      />

      {/* Only fetch the group banner for on-campus students — it also
          self-guards by rendering null when there's no group. */}
      {!offCampusMessage && <MyGroupBanner />}

      {loading ? (
        <SkeletonGrid count={3} />
      ) : offCampusMessage ? (
        <EmptyState icon={School} title="No campus linked to your account" subtitle={offCampusMessage} />
      ) : drives.length === 0 ? (
        <EmptyState
          icon={School}
          title="No drives posted yet"
          subtitle="Check back once your placement cell publishes a new drive — you'll also get a notification."
        />
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
