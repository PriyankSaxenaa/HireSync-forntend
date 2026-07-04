// src/api/resume.api.js
import api from "./axios";

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};