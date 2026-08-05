// src/api/auth.api.js
import api from "./axios";

export const sendOtp = (email) => api.post("/auth/send-otp", { email });
export const verifyOtp = (email, otp) => api.post("/auth/verify-otp", { email, otp });

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");

// ── Forgot password (3-step, mirrors the register OTP flow) ─────────────────
export const sendForgotPasswordOtp = (email) => api.post("/auth/forgot-password/send-otp", { email });
export const verifyForgotPasswordOtp = (email, otp) => api.post("/auth/forgot-password/verify-otp", { email, otp });
export const resetPassword = (email, newPassword) => api.post("/auth/forgot-password/reset", { email, newPassword });