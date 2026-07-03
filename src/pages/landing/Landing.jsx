// src/pages/landing/Landing.jsx
import Navbar from "../../components/common/Navbar";
import Hero from "../../components/common/Hero";
import ColorBends from "../../components/common/ColorBends";

const Landing = () => {
  return (
    <main style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#040611" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <ColorBends
          colors={["#4f46e5", "#6366f1", "#22d3ee"]}
          rotation={90}
          speed={0.15}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1.4}
          noise={0.08}
          parallax={0.8}
          iterations={1}
          intensity={1.1}
          bandWidth={6}
          transparent
          autoRotate={0}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(4,6,17,0.4), transparent, rgba(4,6,17,0.8))",
        }}
      />

      <Navbar />
      <Hero />
    </main>
  );
};

export default Landing;