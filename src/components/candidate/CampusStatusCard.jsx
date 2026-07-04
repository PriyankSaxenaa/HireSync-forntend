// src/components/candidate/CampusStatusCard.jsx
import { useEffect, useState } from "react";
import { School, Users2, ShieldCheck, ShieldAlert, Globe, MapPin } from "lucide-react";
import { getMyProfile } from "../../api/candidate.api";
import { getMyPlacementGroup } from "../../api/placementGroups.api";

// Drop this anywhere on the candidate dashboard/profile page. It quietly
// does nothing (renders null) for off-campus candidates who aren't linked
// to any college — no error, no empty-state noise.
const CampusStatusCard = () => {
  const [loading, setLoading] = useState(true);
  const [college, setCollege] = useState(null);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyProfile();
        const userCollege = data.user?.college;
        if (!userCollege) {
          setLoading(false);
          return; // off-campus candidate — nothing to show
        }
        setCollege(userCollege);

        try {
          const groupRes = await getMyPlacementGroup();
          setGroup(groupRes.data.group || null);
        } catch {
          // no group assigned yet — fine, just show college
        }
      } catch {
        // profile fetch failed — fail silently, this is a supplementary card
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !college) return null;

  return (
    <div
      style={{
        background: "#0c1120",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px",
        padding: "22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: group ? "18px" : 0 }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "13px",
            background: "linear-gradient(135deg,#6366f1,#22d3ee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <School size={19} color="#fff" />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff" }}>{college.name}</p>
            {college.isVerified ? (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 700, color: "#6ee7b7", background: "rgba(16,185,129,0.15)", padding: "3px 9px", borderRadius: "999px" }}>
                <ShieldCheck size={11} /> Verified
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10.5px", fontWeight: 700, color: "#fcd34d", background: "rgba(245,158,11,0.15)", padding: "3px 9px", borderRadius: "999px" }}>
                <ShieldAlert size={11} /> Pending Verification
              </span>
            )}
          </div>
          {college.address && (
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px" }}>
              <MapPin size={11} /> {college.address}
            </p>
          )}
          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#818cf8", textDecoration: "none", marginTop: "4px" }}
            >
              <Globe size={11} /> {college.website}
            </a>
          )}
        </div>
      </div>

      {group && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "rgba(129,140,248,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Users2 size={15} color="#a5b4fc" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#fff" }}>{group.name}</p>
            <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
              {group.description || "Placement group"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusStatusCard;