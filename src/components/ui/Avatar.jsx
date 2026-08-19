// src/components/ui/Avatar.jsx
import { initialsOf } from "../common/UserMenu";

/**
 * Solid initials avatar. `status` adds a presence dot in the corner.
 */
const Avatar = ({ name, src, size = 38, status, style }) => {
  const tone = { online: "var(--hs-ok)", busy: "var(--hs-bad)", away: "var(--hs-warn)" }[status];

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0, ...style }}>
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div
          aria-label={name}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontSize: `${Math.max(10, size * 0.36)}px`,
            fontWeight: 800,
            color: "#fff",
            background: "var(--hs-a2)",
          }}
        >
          {initialsOf(name)}
        </div>
      )}

      {tone && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: Math.max(8, size * 0.26),
            height: Math.max(8, size * 0.26),
            borderRadius: "50%",
            background: tone,
            border: "2px solid var(--hs-bg-elev)",
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
