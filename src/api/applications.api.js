// src/api/applications.api.js
import api from "./axios";

// ── Recruiter (existing) ─────────────────────────────────────────────────────
export const getApplicantsForJob = (jobId) => api.get(`/applications/job/${jobId}/applicants`);
export const updateApplicationStatus = (applicationId, status) =>
  api.put(`/applications/${applicationId}/status`, { status });

// ── Candidate ────────────────────────────────────────────────────────────────
export const applyToJob = (jobId) => api.post(`/applications/apply/${jobId}`);
export const withdrawApplication = (applicationId) => api.delete(`/applications/withdraw/${applicationId}`);
export const getMyApplications = () => api.get("/applications/my-applications");
export const saveJob = (jobId) => api.post(`/applications/save/${jobId}`);
export const getSavedJobs = () => api.get("/applications/saved-jobs");