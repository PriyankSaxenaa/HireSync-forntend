// src/components/candidate/GlowCard.jsx
import SpotlightCard from "../fx/SpotlightCard";

/**
 * Kept as the candidate-side name for the shared spotlight surface, so the
 * existing call sites keep working while inheriting the new card treatment.
 */
const GlowCard = ({ children, style, glow, onClick, hoverLift = true, live = false, ...rest }) => (
  <SpotlightCard glow={glow} onClick={onClick} hover={hoverLift} live={live} padding={0} style={style} {...rest}>
    {children}
  </SpotlightCard>
);

export default GlowCard;
