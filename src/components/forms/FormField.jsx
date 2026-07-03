// src/components/forms/FormField.jsx
const FormField = ({ label, children, marginBottom = 20 }) => (
  <div style={{ marginBottom }}>
    <label
      style={{
        display: "block",
        marginBottom: "8px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "#94a3b8",
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  padding: "12px 16px",
  fontSize: "15px",
  background: "#eef0ff",
  color: "#0f172a",
  border: "2px solid transparent",
  outline: "none",
};

export { FormField, inputStyle };