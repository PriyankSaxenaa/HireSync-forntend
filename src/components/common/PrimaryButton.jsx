// src/components/common/PrimaryButton.jsx
import MagneticButton from "../fx/MagneticButton";

/**
 * Legacy button name, kept so older call sites keep working. It now delegates
 * to the design-system CTA, so it picks up the magnetic pull, the travelling
 * sheen and the active role's gradient for free.
 */
const PrimaryButton = ({ children, secondary = false, onClick, to, type = "button", ...rest }) => (
  <MagneticButton to={to} onClick={onClick} type={type} variant={secondary ? "ghost" : "solid"} {...rest}>
    {children}
  </MagneticButton>
);

export default PrimaryButton;
