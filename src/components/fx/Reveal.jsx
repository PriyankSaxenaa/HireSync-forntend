// src/components/fx/Reveal.jsx
import { useEffect, useRef, useState } from "react";

/**
 * Fades + lifts its children the first time they scroll into view.
 * Uses IntersectionObserver directly (rather than framer's whileInView) so it
 * stays cheap when a page stacks dozens of them.
 */
const Reveal = ({ children, delay = 0, y = 22, as: Tag = "div", className = "", style, ...rest }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // one-way — never re-hide on scroll back up
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.72s var(--hs-ease) ${delay}s, transform 0.72s var(--hs-ease) ${delay}s`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
