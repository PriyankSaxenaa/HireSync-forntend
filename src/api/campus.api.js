// src/api/campus.api.js
import api from "./axios";

export const getCampusDrives = () => api.get("/campus/drives");
export const getCampusDriveById = (id) => api.get(`/campus/drives/${id}`);
export const respondToDrive = (id, response) => api.post(`/campus/drives/${id}/respond`, { response });
export const updateCampusProfile = (data) => api.put("/campus/profile", data);