// src/api/jobs.api.js
import api from "./axios";

// ── Recruiter (existing) ─────────────────────────────────────────────────────
export const getMyJobs = () => api.get("/jobs/recruiter/my-jobs");
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// ── Candidate / any logged-in user ──────────────────────────────────────────
export const getAllJobs = (params) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);