// src/api/college.api.js
import api from "./axios";

export const registerCollege = (data) => api.post("/college/register", data);
export const getAllColleges = () => api.get("/college");
export const verifyCollege = (id) => api.put(`/college/${id}/verify`);
export const getCollegeById = (id) => api.get(`/college/${id}`);