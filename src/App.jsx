// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleGuard from "./components/common/RoleGuard";
import DashboardLayout from "./layouts/DashboardLayout";
import ForgotPassword from "./pages/auth/ForgotPassword";

import ScrollProgress from "./components/fx/ScrollProgress";

import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/dashboard/Users";
import Jobs from "./pages/dashboard/Jobs";
import Colleges from "./pages/dashboard/Colleges";

import RecruiterLayout from "./layouts/RecruiterLayout";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import JobApplicants from "./pages/recruiter/JobApplicants";

import TPOLayout from "./layouts/TPOLayout";
import TPODashboard from "./pages/tpo/TPODashboard";
import TPOStudents from "./pages/tpo/TPOStudents";
import TPOPlacementGroups from "./pages/tpo/TPOPlacementGroups";
import TPODrives from "./pages/tpo/TPODrives";
import TPOCollegeSetup from "./pages/tpo/TPOCollegeSetup";

import CandidateLayout from "./layouts/CandidateLayout";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import BrowseJobs from "./pages/candidate/BrowseJobs";
import JobDetails from "./pages/candidate/JobDetails";
import MyApplications from "./pages/candidate/MyApplications";
import SavedJobs from "./pages/candidate/SavedJobs";
import CampusDrives from "./pages/candidate/CampusDrives";
import CampusDriveDetails from "./pages/candidate/CampusDriveDetails";
import Profile from "./pages/candidate/Profile";

import NotFound from "./pages/landing/NotFound";
import AccountDeletionGuard from "./components/common/AccountDeletionGuard";

const toastOptions = {
  duration: 3200,
  style: {
    background: "#0f0f12",
    color: "#f2f1ee",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: 600,
    padding: "12px 16px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
  },
  success: { iconTheme: { primary: "#2fae72", secondary: "#0f0f12" } },
  error: { iconTheme: { primary: "#cf3355", secondary: "#0f0f12" } },
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global ambience — a scroll rail on every route */}
        <ScrollProgress />

        <Toaster position="top-center" toastOptions={toastOptions} />
        <AccountDeletionGuard />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allow={["admin"]} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="colleges" element={<Colleges />} />
              </Route>
            </Route>

            <Route element={<RoleGuard allow={["recruiter"]} />}>
              <Route path="/recruiter" element={<RecruiterLayout />}>
                <Route index element={<RecruiterDashboard />} />
                <Route path="dashboard" element={<RecruiterDashboard />} />
                <Route path="jobs" element={<RecruiterJobs />} />
                <Route path="jobs/:jobId/applicants" element={<JobApplicants />} />
              </Route>
            </Route>

            <Route element={<RoleGuard allow={["tpo"]} />}>
              <Route path="/tpo" element={<TPOLayout />}>
                <Route index element={<TPODashboard />} />
                <Route path="dashboard" element={<TPODashboard />} />
                <Route path="students" element={<TPOStudents />} />
                <Route path="placement-groups" element={<TPOPlacementGroups />} />
                <Route path="drives" element={<TPODrives />} />
                <Route path="college" element={<TPOCollegeSetup />} />
              </Route>
            </Route>

            <Route element={<RoleGuard allow={["candidate"]} />}>
              <Route path="/candidate" element={<CandidateLayout />}>
                <Route index element={<CandidateDashboard />} />
                <Route path="dashboard" element={<CandidateDashboard />} />
                <Route path="jobs" element={<BrowseJobs />} />
                <Route path="jobs/:id" element={<JobDetails />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="saved" element={<SavedJobs />} />
                <Route path="campus" element={<CampusDrives />} />
                <Route path="campus/:id" element={<CampusDriveDetails />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;