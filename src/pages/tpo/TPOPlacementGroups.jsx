// src/pages/tpo/TPOPlacementGroups.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, X, Users2, Trash2, UserPlus, UserMinus } from "lucide-react";
import {
  getPlacementGroups,
  createPlacementGroup,
  deletePlacementGroup,
  getPlacementGroupById,
  assignStudentToGroup,
  removeStudentFromGroup,
} from "../../api/placementGroups.api";
import { getStudents } from "../../api/tpo.api";
import CollegeGateNotice from "../../components/tpo/CollegeGateNotice";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  background: "#0e0819",
  color: "#fff",
  border: "1px solid rgba(216,180,254,0.15)",
  outline: "none",
};

const TPOPlacementGroups = () => {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gateStatus, setGateStatus] = useState(null); // null | "none" | "unverified"
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null); // group detail drawer
  const [assignId, setAssignId] = useState("");

  const fetchGroups = async () => {
    try {
      const { data } = await getPlacementGroups();
      setGroups(data.groups || []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) setGateStatus("unverified");
      else if (status === 404) setGateStatus("none");
      else toast.error(err.response?.data?.message || "Failed to load groups");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await getStudents();
      setStudents(data.students || []);
    } catch {
      // page still usable without the assign dropdown
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchGroups(), fetchStudents()]);
      setLoading(false);
    })();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPlacementGroup(form);
      toast.success("Placement group created");
      setCreateOpen(false);
      setForm({ name: "", description: "" });
      fetchGroups();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create group");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? Members will be unassigned.`)) return;
    try {
      await deletePlacementGroup(id);
      toast.success("Group deleted");
      setGroups((prev) => prev.filter((g) => g.id !== id));
      if (activeGroup?.group?.id === id) setActiveGroup(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete group");
    }
  };

  const openGroup = async (id) => {
    try {
      const { data } = await getPlacementGroupById(id);
      setActiveGroup(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load group");
    }
  };

  const refreshActiveGroup = async () => {
    if (activeGroup?.group?.id) await openGroup(activeGroup.group.id);
    fetchGroups();
  };

  const handleAssign = async () => {
    if (!assignId) return;
    try {
      await assignStudentToGroup(activeGroup.group.id, assignId);
      toast.success("Student assigned");
      setAssignId("");
      refreshActiveGroup();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign student");
    }
  };

  const handleRemove = async (studentId) => {
    try {
      await removeStudentFromGroup(activeGroup.group.id, studentId);
      toast.success("Student removed");
      refreshActiveGroup();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove student");
    }
  };

  const availableStudents = students.filter(
    (s) => !activeGroup?.group?.students?.some((m) => m._id === s._id)
  );

  if (gateStatus) {
    return <CollegeGateNotice status={gateStatus} />;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>Placement Groups</h1>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#a897c9" }}>Manually organize students for targeted drives.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", border: "none", borderRadius: "999px", padding: "12px 22px", fontSize: "14px", fontWeight: 700, color: "#fff", background: "linear-gradient(to right,#8b5cf6,#d946ef)", cursor: "pointer", boxShadow: "0 0 24px rgba(217,70,239,0.3)" }}
        >
          <Plus size={16} /> New Group
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#a897c9" }}>Loading groups...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {groups.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => openGroup(g.id)}
              style={{ cursor: "pointer", background: "#170f28", border: "1px solid rgba(216,180,254,0.1)", borderRadius: "18px", padding: "20px" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg,#8b5cf6,#d946ef)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users2 size={16} color="#fff" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(g.id, g.name);
                  }}
                  style={{ border: "none", background: "transparent", color: "#fda4af", cursor: "pointer" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff" }}>{g.name}</h3>
              {g.description && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#a897c9" }}>{g.description}</p>}
              <p style={{ margin: "14px 0 0", fontSize: "12px", fontWeight: 700, color: "#f0abfc" }}>{g.studentCount} students</p>
            </motion.div>
          ))}
          {groups.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: "#544468", border: "1px dashed rgba(216,180,254,0.15)", borderRadius: "20px" }}>
              No placement groups yet. Create one to start organizing students.
            </div>
          )}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCreateOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 100 }}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleCreate}
              style={{ width: "100%", maxWidth: "420px", background: "#1a1030", border: "1px solid rgba(216,180,254,0.15)", borderRadius: "20px", padding: "26px", boxSizing: "border-box" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>New Placement Group</h3>
                <button type="button" onClick={() => setCreateOpen(false)} style={{ border: "none", background: "transparent", color: "#a897c9", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <input placeholder="Group name (e.g. Core Branch 2026)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <textarea placeholder="Description (optional)" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{ width: "100%", border: "none", borderRadius: "999px", padding: "12px", fontSize: "13px", fontWeight: 700, color: "#fff", background: "linear-gradient(to right,#8b5cf6,#d946ef)", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Creating..." : "Create Group"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group detail drawer */}
      <AnimatePresence>
        {activeGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGroup(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end", zIndex: 100 }}
          >
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: "440px", height: "100%", overflowY: "auto", background: "#1a1030", borderLeft: "1px solid rgba(216,180,254,0.15)", padding: "26px", boxSizing: "border-box" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#fff" }}>{activeGroup.group?.name}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#a897c9" }}>{activeGroup.group?.studentCount} members</p>
                </div>
                <button onClick={() => setActiveGroup(null)} style={{ border: "none", background: "transparent", color: "#a897c9", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <select value={assignId} onChange={(e) => setAssignId(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                  <option value="">Select student to add...</option>
                  {availableStudents.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.rollNo || "no roll"})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!assignId}
                  style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", borderRadius: "10px", padding: "0 16px", fontSize: "12px", fontWeight: 700, color: "#fff", background: "linear-gradient(to right,#8b5cf6,#d946ef)", cursor: assignId ? "pointer" : "not-allowed", opacity: assignId ? 1 : 0.5 }}
                >
                  <UserPlus size={14} /> Add
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(activeGroup.group?.students || []).map((s) => (
                  <div key={s._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#fff" }}>{s.name}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#7c6f93" }}>
                        {s.rollNo || "—"} · {s.branch || "—"}
                      </p>
                    </div>
                    <button onClick={() => handleRemove(s._id)} style={{ border: "none", background: "transparent", color: "#fda4af", cursor: "pointer" }}>
                      <UserMinus size={15} />
                    </button>
                  </div>
                ))}
                {(activeGroup.group?.students || []).length === 0 && (
                  <p style={{ fontSize: "12px", color: "#7c6f93", textAlign: "center", padding: "20px 0" }}>No members yet — add one above.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TPOPlacementGroups;