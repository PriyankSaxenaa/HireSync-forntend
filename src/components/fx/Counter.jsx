// src/components/fx/Counter.jsx
import { useEffect, useRef, useState } from "react";

/**
 * Eases a number up to `value` whenever it changes, starting from wherever the
 * display currently sits — so a live-updating stat re-animates the delta
 * instead of snapping or restarting from zero.
 */
const Counter = ({ value = 0, duration = 1100, decimals = 0, prefix = "", suffix = "" }) => {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  const mounted = useRef(false);

  useEffect(() => {
    // First paint should still animate in from zero.
    const from = mounted.current ? fromRef.current : 0;
    mounted.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    let raf = 0;
    let start = null;
    const step = (ts) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      // easeOutExpo — fast out of the gate, long settle.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const next = from + (target - from) * eased;
      fromRef.current = next;
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  const shown = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return (
    <>
      {prefix}
      {shown}
      {suffix}
    </>
  );
};

export default Counter;
