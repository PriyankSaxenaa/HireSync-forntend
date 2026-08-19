// src/components/fx/SearchField.jsx
import { useState } from "react";
import { X } from "lucide-react";

/**
 * Icon-leading text field with a clear button. The leading icon picks up the
 * accent colour while focused, matching the field's focus ring.
 */
const SearchField = ({ icon: Icon, value, onChange, onClear, placeholder, flex = "1 1 260px", style }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative", flex, minWidth: 0, ...style }}>
      {Icon && (
        <Icon
          size={16}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? "var(--hs-a2)" : "var(--hs-dim)",
            transition: "color 0.2s var(--hs-ease)",
            pointerEvents: "none",
          }}
        />
      )}

      <input
        className="hs-input"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{ paddingLeft: Icon ? "40px" : undefined, paddingRight: value ? "38px" : undefined }}
      />

      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "grid",
            placeItems: "center",
            width: "22px",
            height: "22px",
            border: "none",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.09)",
            color: "var(--hs-muted)",
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

export default SearchField;
