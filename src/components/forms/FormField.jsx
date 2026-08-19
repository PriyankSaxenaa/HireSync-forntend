// src/components/forms/FormField.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Labelled field wrapper. The label's accent bar lights up while the field
 * inside has focus, so the active row is obvious at a glance.
 */
const FormField = ({ label, hint, error, children, marginBottom = 20, icon: Icon }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{ marginBottom }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {label && (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "8px",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: focused ? "var(--hs-a2)" : "var(--hs-dim)",
            transition: "color 0.2s var(--hs-ease)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: focused ? "12px" : "4px",
              height: "3px",
              borderRadius: "var(--hs-r-full)",
              background: focused ? "var(--hs-grad)" : "var(--hs-dim)",
              transition: "width 0.25s var(--hs-ease), background 0.25s var(--hs-ease)",
            }}
          />
          {Icon && <Icon size={12} />}
          {label}
        </label>
      )}

      {children}

      {(hint || error) && (
        <p
          style={{
            margin: "7px 0 0",
            fontSize: "11.5px",
            color: error ? "var(--hs-bad)" : "var(--hs-dim)",
            lineHeight: 1.5,
          }}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
};

/**
 * Kept for the pages that spread it onto a raw <input>. It now points at the
 * same dark glass treatment as the .hs-input class, so older call sites get
 * the new look without being rewritten.
 */
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "var(--hs-r-sm)",
  padding: "12px 15px",
  fontSize: "14.5px",
  color: "var(--hs-text)",
  background: "rgba(255,255,255,0.045)",
  border: "1px solid rgba(255,255,255,0.09)",
  outline: "none",
  transition: "border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease",
};

/** Standard text input. */
const Input = ({ className = "", ...props }) => (
  <input className={`hs-input ${className}`} {...props} />
);

/** Password input with a reveal toggle. */
const PasswordInput = ({ className = "", ...props }) => {
  const [shown, setShown] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={shown ? "text" : "password"}
        className={`hs-input ${className}`}
        style={{ paddingRight: "44px" }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          display: "grid",
          placeItems: "center",
          width: "28px",
          height: "28px",
          border: "none",
          borderRadius: "var(--hs-r-full)",
          background: "transparent",
          color: "var(--hs-dim)",
          transition: "color 0.18s, background 0.18s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--hs-text)";
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--hs-dim)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        {shown ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
};

/** Native select, restyled to match. */
const Select = ({ className = "", children, ...props }) => (
  <select className={`hs-input ${className}`} style={{ cursor: "pointer" }} {...props}>
    {children}
  </select>
);

/** Multi-line input. */
const TextArea = ({ className = "", rows = 4, ...props }) => (
  <textarea className={`hs-input ${className}`} rows={rows} style={{ resize: "vertical" }} {...props} />
);

export { FormField, inputStyle, Input, PasswordInput, Select, TextArea };
export default FormField;
