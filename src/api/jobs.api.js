import api from "./axios";

export const getMyJobs = () => api.get("/jobs/recruiter/my-jobs");
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);