// src/components/fx/RoleShell.jsx
import Aurora from "./Aurora";

/**
 * Root wrapper for a role's layout. Setting `data-hs-role` here re-points the
 * accent hue for everything inside — one attribute re-skins the entire
 * dashboard's icon tiles, borders and highlights.
 */
const RoleShell = ({ role = "brand", children, particles = false, style }) => (
  <div
    data-hs-role={role}
    style={{
      position: "relative",
      minHeight: "100vh",
      isolation: "isolate",
      ...style,
    }}
  >
    <Aurora fixed particles={particles} blobOpacity={0.7} intensity={1} />
    <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>{children}</div>
  </div>
);

export default RoleShell;
