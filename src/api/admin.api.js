// src/api/admin.api.js
import api from "./axios";

export const getAllUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAllJobsAdmin = () => api.get("/admin/jobs");