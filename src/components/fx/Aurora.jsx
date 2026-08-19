// src/components/fx/Aurora.jsx
import ParticleField from "./ParticleField";

/**
 * The ambient backdrop a surface sits on: one quiet spotlight in the active
 * role's accent hue, fading to black. Deliberately restrained — a single
 * dramatic light source rather than a wash of drifting rainbow blobs, so it
 * reads as considered lighting rather than a generic gradient background.
 *
 * `fixed` pins it to the viewport (whole-page use); otherwise it fills its
 * positioned parent, which is how hero panels and cards use it. Particles
 * and grain are off unless explicitly requested — most surfaces should be
 * quiet.
 */
const Aurora = ({
  fixed = false,
  particles = false,
  grain = false,
  intensity = 1,
  blobOpacity = 1,
  style,
}) => (
  <div
    aria-hidden="true"
    style={{
      position: fixed ? "fixed" : "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
      background: `radial-gradient(closest-side, rgba(var(--hs-a2-rgb), ${0.22 * blobOpacity}), transparent 72%)`,
      backgroundSize: `${140 * intensity}% ${140 * intensity}%`,
      backgroundPosition: "50% -20%",
      backgroundRepeat: "no-repeat",
      ...style,
    }}
  >
    {particles && <ParticleField density={0.00004} maxParticles={36} linkDistance={90} opacity={0.3} />}

    {grain && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />
    )}
  </div>
);

export default Aurora;
