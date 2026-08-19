// src/components/fx/Marquee.jsx
import { Children } from "react";

/**
 * Seamless infinite ticker. Children are rendered twice and the track slides
 * exactly -50%, so the loop point is invisible. Hovering pauses it.
 */
const Marquee = ({
  children,
  duration = 30,
  reverse = false,
  gap = 40,
  pauseOnHover = true,
  fade = true,
  style,
}) => {
  const items = Children.toArray(children);

  const track = (key) => (
    <div key={key} style={{ display: "flex", alignItems: "center", gap: `${gap}px`, paddingRight: `${gap}px` }}>
      {items.map((child, i) => (
        <div key={i} style={{ flexShrink: 0 }}>
          {child}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={[
        fade ? "hs-marquee-mask" : "hs-clip",
        pauseOnHover ? "hs-marquee-pause" : "",
      ].join(" ")}
      style={{ width: "100%", ...style }}
    >
      <div
        className={`hs-marquee${reverse ? " hs-marquee-rev" : ""}`}
        style={{ "--hs-marquee-dur": `${duration}s` }}
      >
        {track("a")}
        {/* Duplicate is aria-hidden so screen readers don't read it twice. */}
        <div aria-hidden="true" style={{ display: "flex" }}>
          {track("b")}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
