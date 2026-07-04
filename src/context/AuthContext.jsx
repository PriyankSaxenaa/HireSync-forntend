// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // There's no GET /me on the backend yet, so we rely on login/register
  // responses to populate the user, and just stop "loading" once checked.
  // If a /api/auth/me endpoint gets added later, call it here instead.
  useEffect(() => {
    const cached = sessionStorage.getItem("hiresync_user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        // ignore corrupt cache
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    sessionStorage.setItem("hiresync_user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — clear client state regardless
    }
    setUser(null);
    sessionStorage.removeItem("hiresync_user");
    // TPOCollegeSetup caches the registered college under a fixed key that
    // isn't scoped per-user — clear it here so the next TPO to log in on
    // this browser (e.g. a fresh account after the old one was deleted)
    // never sees a previous session's college.
    sessionStorage.removeItem("hiresync_tpo_college");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;