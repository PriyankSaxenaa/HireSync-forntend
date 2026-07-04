// src/api/candidate.api.js
import api from "./axios";

// NOTE: these are mounted under /api/jobs/profile on the backend
// (see src/routes/job.routes.js — candidate profile routes live there)
export const getMyProfile = () => api.get("/jobs/profile");
export const updateMyProfile = (data) => api.put("/jobs/profile", data);