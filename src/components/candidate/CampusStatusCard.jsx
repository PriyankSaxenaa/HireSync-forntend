// src/components/candidate/CampusStatusCard.jsx
import { useEffect, useState } from "react";
import { School, Users2, ShieldCheck, ShieldAlert, Globe, MapPin } from "lucide-react";
import { getMyProfile } from "../../api/candidate.api";
import { getMyPlacementGroup } from "../../api/placementGroups.api";
import SpotlightCard from "../fx/SpotlightCard";

/**
 * The candidate's campus affiliation. Renders null for off-campus candidates
 * who aren't linked to a college — no error, no empty-state noise.
 */
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
          // no group assigned yet — fine, just show the college
        }
      } catch {
        // profile fetch failed — fail silently, this is a supplementary card
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !college) return null;

  const verified = Boolean(college.isVerified);
  const tone = verified ? "var(--hs-ok-rgb)" : "var(--hs-warn-rgb)";
  const VerifyIcon = verified ? ShieldCheck : ShieldAlert;

  return (
    <SpotlightCard live={verified} padding={22}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: group ? "18px" : 0 }}>
        <div
          style={{
            width: "46px",
            height: "46px",
            flexShrink: 0,
            borderRadius: "var(--hs-r-lg)",
            display: "grid",
            placeItems: "center",
            background: "rgba(var(--hs-a2-rgb),0.14)",
            border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
          }}
        >
          <School size={20} style={{ color: "var(--hs-a3)" }} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: "15.5px", fontWeight: 800, color: "var(--hs-text)" }}>
              {college.name}
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "10.5px",
                fontWeight: 700,
                color: `rgb(${tone})`,
                background: `rgba(${tone},0.12)`,
                border: `1px solid rgba(${tone},0.3)`,
                padding: "3px 10px",
                borderRadius: "var(--hs-r-full)",
              }}
            >
              <VerifyIcon size={11} /> {verified ? "Verified" : "Pending verification"}
            </span>
          </div>

          {college.address && (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "12px",
                color: "var(--hs-muted)",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <MapPin size={11} /> {college.address}
            </p>
          )}

          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                color: "var(--hs-a2)",
                marginTop: "5px",
                fontWeight: 600,
              }}
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
            gap: "11px",
            paddingTop: "16px",
            borderTop: "1px solid var(--hs-line)",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              flexShrink: 0,
              borderRadius: "11px",
              display: "grid",
              placeItems: "center",
              background: "rgba(var(--hs-a1-rgb),0.16)",
              border: "1px solid rgba(var(--hs-a1-rgb),0.28)",
            }}
          >
            <Users2 size={15} style={{ color: "var(--hs-a1)" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--hs-text)" }}>{group.name}</p>
            <p style={{ margin: 0, fontSize: "11.5px", color: "var(--hs-muted)" }}>
              {group.description || "Placement group"}
            </p>
          </div>
        </div>
      )}
    </SpotlightCard>
  );
};

export default CampusStatusCard;
