// src/components/forms/OtpInput.jsx
import { useRef } from "react";
import { motion } from "framer-motion";

/**
 * Six-box verification code entry, shared by Register and ForgotPassword.
 * Auto-advances on type, steps back on backspace, and accepts a pasted code.
 *
 * The box awaiting input keeps a soft glow pulsing so the cursor position is
 * never ambiguous.
 */
const OtpInput = ({ value = "", onChange, length = 6, disabled = false }) => {
  const refs = useRef([]);
  const nextEmpty = Math.min(value.length, length - 1);

  const handleChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const digits = value.split("");
    digits[i] = val;
    onChange(digits.join("").slice(0, length));
    if (val && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      style={{ display: "flex", gap: "9px", justifyContent: "center", flexWrap: "wrap" }}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, i) => {
        const filled = Boolean(value[i]);
        const isNext = i === nextEmpty && !filled;

        return (
          <motion.input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
            disabled={disabled}
            aria-label={`Digit ${i + 1}`}
            animate={filled ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.24 }}
            style={{
              width: "46px",
              height: "56px",
              textAlign: "center",
              fontSize: "21px",
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              borderRadius: "var(--hs-r-sm)",
              color: "var(--hs-text)",
              background: filled ? "rgba(var(--hs-a2-rgb),0.12)" : "rgba(255,255,255,0.045)",
              border: `1px solid ${filled ? "rgba(var(--hs-a2-rgb),0.6)" : isNext ? "var(--hs-line-strong)" : "var(--hs-line)"}`,
              outline: "none",
              boxShadow: isNext ? "0 0 0 3px rgba(var(--hs-a2-rgb),0.12)" : "none",
              transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
