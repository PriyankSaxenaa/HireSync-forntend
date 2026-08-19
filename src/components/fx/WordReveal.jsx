// src/components/fx/WordReveal.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Splits text into words and fades/lifts them in one by one as the block
 * scrolls into view — a simplified version of the word-by-word reveal used
 * on editorial/agency sites. Runs once via IntersectionObserver, not on
 * every scroll tick, so it stays cheap even with a long headline.
 */
const WordReveal = ({ text, as: Tag = "span", delayStep = 0.045, style, className }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} style={{ ...style, display: "inline" }}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0.12, y: 8 }}
          animate={shown ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: i * delayStep, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Tag>
  );
};

export default WordReveal;
