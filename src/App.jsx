// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleGuard from "./components/common/RoleGuard";
import DashboardLayout from "./layouts/DashboardLayout";

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


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;