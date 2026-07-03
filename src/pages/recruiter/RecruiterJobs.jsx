import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, MapPin, Calendar, Wallet, Users, Pencil, Trash2 } from "lucide-react";
import { getMyJobs, createJob, updateJob, deleteJob } from "../../api/jobs.api";
import JobFormModal from "../../components/recruiter/JobFormModal";

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

  if (loading) return <p style={{ color: "#94a3b8" }}>Loading your jobs...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, color: "#fff" }}>My Jobs</h1>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#94a3b8" }}>
            Manage the jobs you've posted and review applicants.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            borderRadius: "999px",
            padding: "12px 22px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(to right,#f59e0b,#f43f5e)",
            cursor: "pointer",
            boxShadow: "0 0 24px rgba(244,63,94,0.3)",
          }}
        >
          <Plus size={16} /> Post a Job
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" }}>
        {jobs.map((job) => (
          <div
            key={job._id}
            style={{
              background: "#131a26",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px",
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#fff" }}>{job.title}</h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#fb923c", fontWeight: 600 }}>{job.company}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#94a3b8" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={13} /> {job.location}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Wallet size={13} /> {job.salaryRange || "Not Disclosed"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={13} />
                Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "—"}
              </span>
            </div>

            {job.skillsRequired?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {job.skillsRequired.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#fdba74",
                      background: "rgba(245,158,11,0.12)",
                      padding: "4px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {s}
                  </span>
                ))}
                {job.skillsRequired.length > 5 && (
                  <span style={{ fontSize: "11px", color: "#64748b" }}>+{job.skillsRequired.length - 5} more</span>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "6px",
                paddingTop: "14px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <button
                onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#fff",
                  background: "linear-gradient(to right,#f59e0b,#f43f5e)",
                  cursor: "pointer",
                }}
              >
                <Users size={13} /> Applicants
              </button>
              <button
                onClick={() => openEdit(job)}
                title="Edit job"
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  background: "transparent",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(job._id, job.title)}
                disabled={savingId === job._id}
                title="Delete job"
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(244,63,94,0.3)",
                  borderRadius: "10px",
                  background: "transparent",
                  color: "#fda4af",
                  cursor: savingId === job._id ? "not-allowed" : "pointer",
                  opacity: savingId === job._id ? 0.5 : 1,
                  flexShrink: 0,
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 20px",
              color: "#475569",
              border: "1px dashed rgba(255,255,255,0.1)",
              borderRadius: "20px",
            }}
          >
            <p style={{ margin: "0 0 16px" }}>You haven't posted any jobs yet.</p>
            <button
              onClick={openCreate}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(to right,#f59e0b,#f43f5e)",
                cursor: "pointer",
              }}
            >
              Post your first job
            </button>
          </div>
        )}
      </div>

      {modalOpen && <JobFormModal job={editingJob} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />}
    </div>
  );
};

export default RecruiterJobs;