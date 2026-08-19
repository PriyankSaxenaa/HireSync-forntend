// src/components/fx/Skeleton.jsx

/** Shimmering placeholder block. `lines` renders a stacked text skeleton. */
export const Skeleton = ({ w = "100%", h = 14, r = "8px", style }) => (
  <div className="hs-skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

/** A card-shaped loading placeholder, used while lists fetch. */
export const SkeletonCard = ({ lines = 3, height = 150 }) => (
  <div className="hs-card" style={{ padding: "20px", minHeight: height }}>
    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "18px" }}>
      <Skeleton w={44} h={44} r="14px" />
      <div style={{ flex: 1 }}>
        <Skeleton w="60%" h={13} style={{ marginBottom: 8 }} />
        <Skeleton w="38%" h={10} />
      </div>
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} w={`${100 - i * 14}%`} h={10} style={{ marginBottom: 9 }} />
    ))}
  </div>
);

/** A grid of skeleton cards — the standard list-loading state. */
export const SkeletonGrid = ({ count = 6, min = 300 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: "16px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Skeleton;
