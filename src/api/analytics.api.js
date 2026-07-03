import api from "./axios";

export const getRecruiterDashboard = () => api.get("/analytics/dashboard");