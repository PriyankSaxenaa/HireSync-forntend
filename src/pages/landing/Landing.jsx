import Navbar from "../../components/common/Navbar";
import Hero from "../../components/common/Hero";
import ColorBends from "../../components/common/ColorBends";

const Landing = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816]">

      {/* Background */}

      <div className="absolute inset-0">

        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0.15}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
          autoRotate={0}
        />

      </div>

      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      <Navbar />

      <Hero />

    </main>
  );
};

export default Landing;