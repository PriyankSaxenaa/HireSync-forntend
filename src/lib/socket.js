// src/lib/socket.js
import { io } from "socket.io-client";

// Socket.IO runs on the same server as the REST API but NOT under the
// "/api" prefix (see server.js — it's attached directly to the http server).
// Strip a trailing "/api" from VITE_API_URL to get the right base.
const SOCKET_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");

let socket = null;

// withCredentials sends the httpOnly auth cookie along with the handshake —
// the backend's socket auth (config/socket.js) already falls back to reading
// the JWT from that cookie, so no token wrangling is needed here.
export function connectSocket() {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, {
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