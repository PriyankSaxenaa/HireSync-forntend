// src/constants/platformFacts.js
//
// HireSync hasn't launched — there is no real traffic, so the marketing
// surfaces must not claim any. Everything here is a structural fact about
// the build itself (route count, model count, guard coverage), verified
// against the actual codebase rather than invented. Keep this file as the
// single source so Hero, the landing page and the auth panel can't drift
// out of sync with each other or with reality.

// 4 top-level role routes in App.jsx: /candidate, /recruiter, /tpo, /admin
// 12 route modules mounted in backend/src/app.js
// 10 Mongoose models in backend/src/models
export const platformFacts = [
  { value: 4, suffix: "", label: "Role-based workspaces" },
  { value: 12, suffix: "", label: "Backend API modules" },
  { value: 10, suffix: "", label: "Data models" },
  { value: 100, suffix: "%", label: "Routes role-guarded" },
];

// What's actually implemented, for the honest ticker — no usage claims.
export const capabilityTicker = [
  "SKILL-OVERLAP MATCHING",
  "REALTIME NOTIFICATIONS",
  "RESUME PARSING",
  "CAMPUS DRIVE WORKFLOWS",
  "ROLE-SCOPED ACCESS",
  "PLACEMENT ANALYTICS",
];
