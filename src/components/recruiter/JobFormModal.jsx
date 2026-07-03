import { useState } from "react";
import { X } from "lucide-react";

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  background: "#0b0f17",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.03em",
  color: "#94a3b8",
};

const toInputDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const JobFormModal = ({ job, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: job?.title || "",
    company: job?.company || "",
    description: job?.description || "",
    location: job?.location || "",
    salaryRange: job?.salaryRange || "",
    skillsRequired: (job?.skillsRequired || []).join(", "),
    applicationDeadline: toInputDate(job?.applicationDeadline),
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        skillsRequired: form.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#131a26",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "28px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
          <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "#fff" }}>
            {job ? "Edit Job" : "Post a New Job"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "999px",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label style={labelStyle}>Job Title</label>
            <input name="title" value={form.title} onChange={handleChange} required style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Company</label>
            <input name="company" value={form.company} onChange={handleChange} required style={fieldStyle} />
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            minLength={20}
            rows={4}
            style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label style={labelStyle}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} required style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>Salary Range</label>
            <input
              name="salaryRange"
              value={form.salaryRange}
              onChange={handleChange}
              placeholder="e.g. 6-10 LPA"
              style={fieldStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Required Skills (comma separated)</label>
          <input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            required
            placeholder="react, node.js, mongodb"
            style={fieldStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Application Deadline</label>
          <input
            type="date"
            name="applicationDeadline"
            value={form.applicationDeadline}
            onChange={handleChange}
            required
            style={fieldStyle}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "999px",
            padding: "13px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(to right,#f59e0b,#f43f5e)",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Saving..." : job ? "Save Changes" : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default JobFormModal;