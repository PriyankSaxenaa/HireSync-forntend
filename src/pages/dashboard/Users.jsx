// src/pages/dashboard/Users.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Search } from "lucide-react";
import { getAllUsers, deleteUser } from "../../api/admin.api";

const ROLE_STYLES = {
  admin: { bg: "rgba(244,63,94,0.15)", color: "#fda4af" },
  recruiter: { bg: "rgba(34,211,238,0.15)", color: "#67e8f9" },
  tpo: { bg: "rgba(167,139,250,0.15)", color: "#c4b5fd" },
  candidate: { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc" },
};

const initialsOf = (name = "?") =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [hoveredRow, setHoveredRow] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const roles = ["all", "admin", "recruiter", "tpo", "candidate"];

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading users...</p>;

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={16} color="#64748b" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px 10px 40px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#0c1120",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: "9px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.1)",
                background: roleFilter === r ? "linear-gradient(to right,#6366f1,#22d3ee)" : "transparent",
                color: "#fff",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "12px" }}>
        {filtered.length} of {users.length} users
      </p>

      {/* Table */}
      <div style={{ borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", background: "#0c1120" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["User", "Email", "Role", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "14px 24px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const roleStyle = ROLE_STYLES[u.role] || { bg: "rgba(255,255,255,0.1)", color: "#fff" };
              return (
                <tr
                  key={u._id}
                  onMouseEnter={() => setHoveredRow(u._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: hoveredRow === u._id ? "rgba(255,255,255,0.03)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: "linear-gradient(135deg,#6366f1,#22d3ee)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {initialsOf(u.name)}
                      </div>
                      <span style={{ fontWeight: 600, color: "#fff", fontSize: "14px" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 24px", color: "#94a3b8", fontSize: "14px" }}>{u.email}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        background: roleStyle.bg,
                        color: roleStyle.color,
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "14px 24px", textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      disabled={deletingId === u._id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid rgba(244,63,94,0.3)",
                        background: "transparent",
                        color: "#fda4af",
                        padding: "7px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: deletingId === u._id ? "not-allowed" : "pointer",
                        opacity: deletingId === u._id ? 0.5 : 1,
                      }}
                    >
                      <Trash2 size={13} />
                      {deletingId === u._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "40px", textAlign: "center", color: "#475569" }}>
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;