import api from "./axios";

export const getApplicantsForJob = (jobId) => api.get(`/applications/job/${jobId}/applicants`);
export const updateApplicationStatus = (applicationId, status) =>
  api.put(`/applications/${applicationId}/status`, { status });