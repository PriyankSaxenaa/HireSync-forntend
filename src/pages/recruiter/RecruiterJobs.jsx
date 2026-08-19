// src/pages/recruiter/RecruiterJobs.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, MapPin, Calendar, Wallet, Users, Pencil, Trash2, Briefcase } from "lucide-react";
import { getMyJobs, createJob, updateJob, deleteJob } from "../../api/jobs.api";
import JobFormModal from "../../components/recruiter/JobFormModal";
import SpotlightCard from "../../components/fx/SpotlightCard";
import PageHeader from "../../components/fx/PageHeader";
import EmptyState from "../../components/fx/EmptyState";
import MagneticButton from "../../components/fx/MagneticButton";
import { SkeletonGrid } from "../../components/fx/Skeleton";

const Meta = ({ icon: Icon, children }) => (
  <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "var(--hs-muted)" }}>
    <Icon size={13} style={{ color: "var(--hs-dim)", flexShrink: 0 }} />
    {children}
  </span>
);

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getMyJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreate = () => {
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingJob) {
        await updateJob(editingJob._id, formData);
        toast.success("Job updated successfully");
      } else {
        await createJob(formData);
        toast.success("Job posted successfully");
      }
      setModalOpen(false);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setSavingId(id);
    try {
      await deleteJob(id);
      toast.success("Job deleted");
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    } finally {
      setSavingId(null);
    }
  };

  const iconBtn = (tone) => ({
    width: "36px",
    height: "36px",
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    border: `1px solid ${tone ? `rgba(${tone},0.3)` : "var(--hs-line)"}`,
    borderRadius: "var(--hs-r-full)",
    background: "transparent",
    color: tone ? `rgb(${tone})` : "var(--hs-muted)",
    transition: "all 0.2s var(--hs-ease)",
  });

  return (
    <div>
      <PageHeader
        eyebrow="Postings"
        icon={Briefcase}
        title="My jobs"
        liveLabel={`${jobs.length} ACTIVE`}
        subtitle="Manage the roles you've published and review who applied."
        actions={
          <MagneticButton onClick={openCreate}>
            <Plus size={16} /> Post a job
          </MagneticButton>
        }
      />

      {loading ? (
        <SkeletonGrid count={3} min={320} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="You haven't posted any jobs yet"
          subtitle="Publish your first role and candidates will start showing up here."
          action={
            <MagneticButton onClick={openCreate}>
              <Plus size={15} /> Post your first job
            </MagneticButton>
          }
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
          {jobs.map((job) => (
            <SpotlightCard
              key={job._id}
              padding={22}
              style={{ display: "flex", flexDirection: "column", gap: "14px", height: "100%" }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "var(--hs-text)", lineHeight: 1.3 }}>
                  {job.title}
                </h3>
                <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--hs-a1)", fontWeight: 700 }}>
                  {job.company}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <Meta icon={MapPin}>{job.location || "—"}</Meta>
                <Meta icon={Wallet}>{job.salaryRange || "Not disclosed"}</Meta>
                <Meta icon={Calendar}>
                  Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "—"}
                </Meta>
              </div>

              {job.skillsRequired?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {job.skillsRequired.slice(0, 5).map((s) => (
                    <span key={s} className="hs-chip" style={{ fontSize: "10.5px", padding: "3px 10px" }}>
                      {s}
                    </span>
                  ))}
                  {job.skillsRequired.length > 5 && (
                    <span style={{ fontSize: "11px", color: "var(--hs-dim)", alignSelf: "center" }}>
                      +{job.skillsRequired.length - 5} more
                    </span>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "auto",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--hs-line)",
                }}
              >
                <button
                  onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                    border: "none",
                    borderRadius: "var(--hs-r-full)",
                    padding: "10px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#fff",
                    background: "var(--hs-a2)",
                  }}
                >
                  <Users size={14} /> Applicants
                </button>

                <button
                  onClick={() => openEdit(job)}
                  title="Edit job"
                  aria-label="Edit job"
                  style={iconBtn()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(var(--hs-a2-rgb),0.45)";
                    e.currentTarget.style.color = "var(--hs-a2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--hs-line)";
                    e.currentTarget.style.color = "var(--hs-muted)";
                  }}
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => handleDelete(job._id, job.title)}
                  disabled={savingId === job._id}
                  title="Delete job"
                  aria-label="Delete job"
                  style={{
                    ...iconBtn("var(--hs-bad-rgb)"),
                    cursor: savingId === job._id ? "not-allowed" : "pointer",
                    opacity: savingId === job._id ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.14)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {modalOpen && <JobFormModal job={editingJob} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />}
    </div>
  );
};

export default RecruiterJobs;
