// src/api/placementGroups.api.js
import api from "./axios";

export const createPlacementGroup = (data) => api.post("/placement-groups", data);
export const getPlacementGroups = () => api.get("/placement-groups");
export const getPlacementGroupById = (id) => api.get(`/placement-groups/${id}`);
export const updatePlacementGroup = (id, data) => api.put(`/placement-groups/${id}`, data);
export const deletePlacementGroup = (id) => api.delete(`/placement-groups/${id}`);

export const assignStudentToGroup = (groupId, studentId) =>
  api.post(`/placement-groups/${groupId}/students`, { studentId });
export const removeStudentFromGroup = (groupId, studentId) =>
  api.delete(`/placement-groups/${groupId}/students/${studentId}`);
export const bulkAssignStudents = (groupId, studentIds) =>
  api.post(`/placement-groups/${groupId}/students/bulk`, { studentIds });
export const bulkRemoveStudents = (studentIds) =>
  api.post(`/placement-groups/students/bulk-remove`, { studentIds });
export const moveStudent = (studentId, toGroupId) =>
  api.post(`/placement-groups/move`, { studentId, toGroupId });

// candidate-side (not used on the TPO dashboard, kept for completeness)
export const getMyPlacementGroup = () => api.get("/placement-groups/my-group");