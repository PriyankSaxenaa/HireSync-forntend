// src/api/recommendations.api.js
import api from "./axios";

export const getRecommendedJobs = () => api.get("/recommendations/jobs");
export const getRecommendedCandidates = (jobId) => api.get(`/recommendations/candidates/${jobId}`);