// src/components/recruiter/JobFormModal.jsx
import { useState } from "react";
import { Briefcase, Building2, MapPin, Wallet, Calendar, Sparkles, FileText } from "lucide-react";
import Modal from "../fx/Modal";
import MagneticButton from "../fx/MagneticButton";
import { FormField, Input, TextArea } from "../forms/FormField";

// <input type="date"> only accepts YYYY-MM-DD.
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

  // Live preview of the comma-separated skills as chips.
  const skillPreview = form.skillsRequired
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Modal
      open
      onClose={onClose}
      icon={Briefcase}
      title={job ? "Edit job" : "Post a new job"}
      subtitle={job ? "Update the details candidates see." : "Publish a role and start collecting applications."}
      width={580}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 14px" }}>
          <FormField label="Job title" icon={Briefcase} marginBottom={16}>
            <Input name="title" value={form.title} onChange={handleChange} required placeholder="Frontend Engineer" />
          </FormField>

          <FormField label="Company" icon={Building2} marginBottom={16}>
            <Input name="company" value={form.company} onChange={handleChange} required placeholder="Acme Inc." />
          </FormField>
        </div>

        <FormField label="Description" icon={FileText} marginBottom={16}>
          <TextArea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            minLength={20}
            rows={4}
            placeholder="What the role involves, who you're looking for, what the team is like…"
          />
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 14px" }}>
          <FormField label="Location" icon={MapPin} marginBottom={16}>
            <Input name="location" value={form.location} onChange={handleChange} required placeholder="Bengaluru, India" />
          </FormField>

          <FormField label="Salary range" icon={Wallet} marginBottom={16}>
            <Input
              name="salaryRange"
              value={form.salaryRange}
              onChange={handleChange}
              placeholder="e.g. 6-10 LPA"
            />
          </FormField>
        </div>

        <FormField
          label="Required skills"
          icon={Sparkles}
          marginBottom={skillPreview.length ? 10 : 16}
          hint="Comma separated — these drive candidate matching."
        >
          <Input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            required
            placeholder="react, node.js, mongodb"
          />
        </FormField>

        {skillPreview.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
            {skillPreview.map((s, i) => (
              <span key={`${s}-${i}`} className="hs-chip" style={{ fontSize: "10.5px", padding: "3px 10px" }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <FormField label="Application deadline" icon={Calendar} marginBottom={24}>
          <Input
            type="date"
            name="applicationDeadline"
            value={form.applicationDeadline}
            onChange={handleChange}
            required
          />
        </FormField>

        <MagneticButton
          type="submit"
          disabled={submitting}
          strength={0.1}
          style={{ width: "100%", padding: "14px", fontSize: "14px" }}
        >
          {submitting ? "Saving…" : job ? "Save changes" : "Post job"}
        </MagneticButton>
      </form>
    </Modal>
  );
};

export default JobFormModal;
