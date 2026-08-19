// src/components/fx/TypeCycle.jsx
import { useEffect, useState } from "react";

/**
 * Types a word out, holds it, deletes it, moves to the next — forever.
 * Used in the landing hero so the headline is never sitting still.
 */
const TypeCycle = ({
  words = [],
  typeSpeed = 68,
  deleteSpeed = 34,
  hold = 1500,
  className = "",
  style,
}) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const word = words[index % words.length];

    // Word fully typed — pause, then start deleting.
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), hold);
      return () => clearTimeout(t);
    }

    // Word fully deleted — advance to the next one.
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? deleteSpeed : typeSpeed
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, hold]);

  return (
    <span className={className} style={style}>
      {text}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "3px",
          height: "0.92em",
          marginLeft: "4px",
          verticalAlign: "-0.08em",
          borderRadius: "2px",
          background: "currentColor",
          animation: "hs-caret 1.1s steps(1) infinite",
        }}
      />
    </span>
  );
};

export default TypeCycle;
