// src/layouts/RecruiterLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { Briefcase, LayoutGrid } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import RoleShell from "../components/fx/RoleShell";
import PageTransition from "../components/fx/PageTransition";
import TopNav from "../components/common/TopNav";
import UserMenu from "../components/common/UserMenu";

const navItems = [
  { to: "/recruiter/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/recruiter/jobs", label: "My Jobs", icon: Briefcase },
];

const RecruiterLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <RoleShell role="recruiter">
      <TopNav
        navItems={navItems}
        tag="RECRUITER"
        pillId="hs-recruiter-pill"
        maxWidth={1240}
        right={<UserMenu user={user} roleLabel="Recruiter" navItems={navItems} onLogout={handleLogout} />}
      />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "30px 24px 70px" }}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </RoleShell>
  );
};

export default RecruiterLayout;
