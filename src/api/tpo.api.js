// src/api/tpo.api.js
import api from "./axios";

// ── Student import / roster ─────────────────────────────────────────────────
export const importStudents = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/tpo/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getStudents = () => api.get("/tpo/students");
export const getStudentById = (id) => api.get(`/tpo/students/${id}`);

// ── Campus drives ────────────────────────────────────────────────────────────
export const createDrive = (data) => api.post("/tpo/drives", data);
export const getDrives = () => api.get("/tpo/drives");
export const getDriveById = (id) => api.get(`/tpo/drives/${id}`);
export const updateDrive = (id, data) => api.put(`/tpo/drives/${id}`, data);
export const updateDriveStatus = (id, status) => api.put(`/tpo/drives/${id}/status`, { status });
export const downloadDriveReport = (id) => api.get(`/tpo/drives/${id}/report`, { responseType: "blob" });

// ── TPO analytics ────────────────────────────────────────────────────────────
export const getTpoAnalytics = () => api.get("/tpo/analytics");

// ── Legacy filter-based student groups (kept for backward compatibility) ────
export const createStudentGroup = (data) => api.post("/tpo/groups", data);
export const getStudentGroups = () => api.get("/tpo/groups");
export const getStudentGroupById = (id) => api.get(`/tpo/groups/${id}`);
export const updateStudentGroup = (id, data) => api.put(`/tpo/groups/${id}`, data);