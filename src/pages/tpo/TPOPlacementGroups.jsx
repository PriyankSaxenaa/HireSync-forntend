// src/pages/tpo/TPOPlacementGroups.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Users2, Trash2, UserPlus, UserMinus } from "lucide-react";
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
import SpotlightCard from "../../components/fx/SpotlightCard";
import PageHeader from "../../components/fx/PageHeader";
import EmptyState from "../../components/fx/EmptyState";
import MagneticButton from "../../components/fx/MagneticButton";
import Modal from "../../components/fx/Modal";
import Drawer from "../../components/fx/Drawer";
import Counter from "../../components/fx/Counter";
import { SkeletonGrid } from "../../components/fx/Skeleton";
import { FormField, Input, TextArea, Select } from "../../components/forms/FormField";

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
      // page is still usable without the assign dropdown
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

  if (gateStatus) return <CollegeGateNotice status={gateStatus} />;

  const members = activeGroup?.group?.students || [];
  const totalGrouped = groups.reduce((sum, g) => sum + (g.studentCount || 0), 0);

  return (
    <div>
      <PageHeader
        eyebrow="Segmentation"
        icon={Users2}
        title="Placement groups"
        liveLabel={`${groups.length} GROUPS`}
        subtitle={
          <>
            Organise students into groups so drives reach exactly the right cohort.{" "}
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={totalGrouped} />
            </b>{" "}
            student{totalGrouped === 1 ? "" : "s"} assigned so far.
          </>
        }
        actions={
          <MagneticButton onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> New group
          </MagneticButton>
        }
      />

      {loading ? (
        <SkeletonGrid count={3} min={260} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={Users2}
          title="No placement groups yet"
          subtitle="Create one to start organising students into targetable cohorts."
          action={
            <MagneticButton onClick={() => setCreateOpen(true)}>
              <Plus size={15} /> Create your first group
            </MagneticButton>
          }
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {groups.map((g) => (
            <SpotlightCard
              key={g.id}
              padding={20}
              live={g.studentCount > 0}
              onClick={() => openGroup(g.id)}
              style={{ height: "100%" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--hs-r)",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(var(--hs-a2-rgb),0.14)",
                    border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                  }}
                >
                  <Users2 size={17} style={{ color: "var(--hs-a3)" }} />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(g.id, g.name);
                  }}
                  aria-label={`Delete ${g.name}`}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "32px",
                    height: "32px",
                    border: "1px solid rgba(var(--hs-bad-rgb),0.24)",
                    borderRadius: "var(--hs-r-full)",
                    background: "transparent",
                    color: "var(--hs-bad)",
                    transition: "background 0.2s var(--hs-ease)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.14)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 style={{ margin: 0, fontSize: "15.5px", fontWeight: 800, color: "var(--hs-text)" }}>{g.name}</h3>
              {g.description && (
                <p style={{ margin: "5px 0 0", fontSize: "12px", lineHeight: 1.55, color: "var(--hs-muted)" }}>
                  {g.description}
                </p>
              )}

              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: "12.5px",
                  fontWeight: 800,
                  color: "var(--hs-a2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <span className="hs-pulse-dot" style={{ width: 6, height: 6 }} />
                <Counter value={g.studentCount || 0} /> student{g.studentCount === 1 ? "" : "s"}
              </p>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* ── Create group ──────────────────────────────────────────────────── */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New placement group"
        subtitle="Give the cohort a name your team will recognise."
        icon={Users2}
        width={440}
      >
        <form onSubmit={handleCreate}>
          <FormField label="Group name" icon={Users2}>
            <Input
              placeholder="e.g. Core Branch 2026"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </FormField>

          <FormField label="Description" marginBottom={24} hint="Optional — what this cohort is for.">
            <TextArea
              placeholder="Students eligible for core engineering roles…"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormField>

          <MagneticButton
            type="submit"
            disabled={submitting}
            strength={0.1}
            style={{ width: "100%", padding: "13px", fontSize: "14px" }}
          >
            {submitting ? "Creating…" : "Create group"}
          </MagneticButton>
        </form>
      </Modal>

      {/* ── Group detail ──────────────────────────────────────────────────── */}
      <Drawer
        open={Boolean(activeGroup)}
        onClose={() => setActiveGroup(null)}
        title={activeGroup?.group?.name}
        subtitle={`${activeGroup?.group?.studentCount || 0} member${activeGroup?.group?.studentCount === 1 ? "" : "s"}`}
        icon={Users2}
      >
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <Select value={assignId} onChange={(e) => setAssignId(e.target.value)} style={{ flex: 1 }}>
            <option value="">Select a student to add…</option>
            {availableStudents.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.rollNo || "no roll"})
              </option>
            ))}
          </Select>

          <button
            onClick={handleAssign}
            disabled={!assignId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "none",
              borderRadius: "var(--hs-r-full)",
              padding: "0 16px",
              fontSize: "12.5px",
              fontWeight: 700,
              color: "#fff",
              background: "var(--hs-a2)",
              cursor: assignId ? "pointer" : "not-allowed",
              opacity: assignId ? 1 : 0.45,
              flexShrink: 0,
            }}
          >
            <UserPlus size={14} /> Add
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {members.map((s) => (
            <div
              key={s._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "var(--hs-r-sm)",
                background: "rgba(255,255,255,0.035)",
                border: "1px solid var(--hs-line)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "var(--hs-text)" }}>{s.name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "var(--hs-dim)" }}>
                  {s.rollNo || "—"} · {s.branch || "—"}
                </p>
              </div>

              <button
                onClick={() => handleRemove(s._id)}
                aria-label={`Remove ${s.name}`}
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: "30px",
                  height: "30px",
                  flexShrink: 0,
                  border: "1px solid rgba(var(--hs-bad-rgb),0.24)",
                  borderRadius: "var(--hs-r-full)",
                  background: "transparent",
                  color: "var(--hs-bad)",
                  transition: "background 0.2s var(--hs-ease)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.14)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <UserMinus size={14} />
              </button>
            </div>
          ))}

          {members.length === 0 && (
            <p style={{ fontSize: "12.5px", color: "var(--hs-dim)", textAlign: "center", padding: "26px 0" }}>
              No members yet — add one above.
            </p>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default TPOPlacementGroups;
