// src/lib/socket.js
// Thin wrapper around socket.io-client. The backend authenticates sockets via
// the same httpOnly `token` cookie used by the REST API (see src/config/socket.js
// on the backend) — as long as we connect with withCredentials:true and hit the
// same origin/CORS-allowed URL, no token has to be read or passed manually.
import { io } from "socket.io-client";

let socket = null;

function socketUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  return apiUrl.replace(/\/api\/?$/, "");
}

export function connectSocket() {
  if (socket && socket.connected) return socket;
  socket = io(socketUrl(), {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}