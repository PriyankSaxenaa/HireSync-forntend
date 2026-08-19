// src/layouts/LandingLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Aurora from "../components/fx/Aurora";

/**
 * Public marketing shell — brand palette, ambient backdrop, navbar and footer
 * around whatever page renders into the outlet.
 */
const LandingLayout = ({ children }) => (
  <div data-hs-role="brand" style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
    <Aurora fixed blobOpacity={0.32} intensity={1.15} />

    <div style={{ position: "relative", zIndex: 1 }}>
      <Navbar />
      <main style={{ paddingTop: "110px" }}>{children || <Outlet />}</main>
      <Footer />
    </div>
  </div>
);

export default LandingLayout;
