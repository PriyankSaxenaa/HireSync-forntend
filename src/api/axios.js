// src/api/axios.js
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // backend uses httpOnly cookie for JWT
});

// Catches the case where a user's account was deleted while they were
// offline (no active socket to receive the real-time event). Their next
// API call hits the DB-existence check in auth.middleware.js, which returns
// this specific code — distinct from a generic 401 so it never misfires on
// things like a failed login attempt.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.code === "ACCOUNT_DELETED") {
      sessionStorage.removeItem("hiresync_user");
      toast.error(error.response.data.message || "Your account has been deleted.", { duration: 6000 });
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;