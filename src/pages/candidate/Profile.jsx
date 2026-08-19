// src/pages/candidate/Profile.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { UploadCloud, FileText, MapPin, Sparkles, X, CheckCircle2, UserCircle2, Plus } from "lucide-react";
import SpotlightCard from "../../components/fx/SpotlightCard";
import SkillPill from "../../components/candidate/SkillPill";
import CampusStatusCard from "../../components/candidate/CampusStatusCard";
import PageHeader from "../../components/fx/PageHeader";
import ProgressRing from "../../components/fx/ProgressRing";
import MagneticButton from "../../components/fx/MagneticButton";
import Loader from "../../components/fx/Loader";
import { FormField, Input } from "../../components/forms/FormField";
import { getMyProfile, updateMyProfile } from "../../api/candidate.api";
import { uploadResume } from "../../api/resume.api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({ name: "", location: "" });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getMyProfile();
      setProfile(data.user);
      setForm({ name: data.user.name || "", location: data.user.location || "" });
      setSkills(data.user.skills || []);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addSkill = () => {
    const v = skillInput.trim().toLowerCase();
    if (v && !skills.includes(v)) setSkills([...skills, v]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateMyProfile({ ...form, skills });
      setProfile(data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF resumes are accepted");
      return;
    }
    setUploading(true);
    try {
      const { data } = await uploadResume(file);
      toast.success(`Resume uploaded — extracted ${data.extractedSkills.length} skill(s)`);
      setSkills(data.allSkills || []);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => uploadFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };

  // Four equally-weighted signals make up the completeness score.
  const completeness = useMemo(() => {
    const checks = [Boolean(form.name), Boolean(form.location), skills.length > 0, Boolean(profile?.resumeUrl)];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form.name, form.location, skills.length, profile?.resumeUrl]);

  if (loading) return <Loader label="Loading your profile" full />;

  const complete = completeness === 100;

  return (
    <div style={{ maxWidth: "860px" }}>
      <PageHeader
        eyebrow="Your profile"
        icon={UserCircle2}
        title={form.name || "My profile"}
        live={false}
        subtitle={profile?.email}
        actions={
          <ProgressRing value={completeness} size={86} stroke={6} label="COMPLETE" />
        }
      />

      <div style={{ display: "grid", gap: "18px" }}>
        <CampusStatusCard />

        {/* ── Resume ────────────────────────────────────────────────────── */}
        <SpotlightCard hover={false} live={!profile?.resumeUrl} padding={24}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 800,
                color: "var(--hs-text)",
                display: "flex",
                alignItems: "center",
                gap: "9px",
              }}
            >
              <FileText size={16} style={{ color: "var(--hs-a2)" }} /> Resume
            </h3>

            {complete && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--hs-ok)",
                  background: "rgba(var(--hs-ok-rgb),0.12)",
                  border: "1px solid rgba(var(--hs-ok-rgb),0.28)",
                  padding: "4px 11px",
                  borderRadius: "var(--hs-r-full)",
                }}
              >
                <CheckCircle2 size={12} /> Profile complete
              </span>
            )}
          </div>

          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--hs-info)",
                marginBottom: "16px",
              }}
            >
              <FileText size={14} /> View current resume
            </a>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="resume-upload"
          />

          <motion.label
            htmlFor="resume-upload"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.99 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              border: `1.5px dashed ${dragging ? "rgba(var(--hs-a2-rgb),0.7)" : "rgba(var(--hs-a2-rgb),0.3)"}`,
              borderRadius: "var(--hs-r-lg)",
              padding: "30px 22px",
              cursor: uploading ? "not-allowed" : "pointer",
              color: "var(--hs-muted)",
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "center",
              background: dragging ? "rgba(var(--hs-a2-rgb),0.1)" : "rgba(var(--hs-a1-rgb),0.05)",
              transition: "all 0.24s var(--hs-ease)",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "var(--hs-r)",
                display: "grid",
                placeItems: "center",
                background: "var(--hs-a2)",
                animation: uploading ? "hs-breathe 1.4s ease-in-out infinite" : undefined,
              }}
            >
              <UploadCloud size={20} color="#fff" />
            </div>

            {uploading ? (
              <span className="hs-shimmer-text">Uploading &amp; parsing your skills…</span>
            ) : (
              <>
                <span style={{ color: "var(--hs-text)" }}>
                  {profile?.resumeUrl ? "Upload a new resume" : "Drop your resume here"}
                </span>
                <span style={{ fontSize: "11.5px", color: "var(--hs-dim)", fontWeight: 500 }}>
                  PDF, max 5MB — we&apos;ll extract your skills automatically
                </span>
              </>
            )}
          </motion.label>
        </SpotlightCard>

        {/* ── Details ───────────────────────────────────────────────────── */}
        <SpotlightCard hover={false} padding={24}>
          <form onSubmit={handleSave}>
            <FormField label="Full name" icon={UserCircle2}>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </FormField>

            <FormField label="Location" icon={MapPin}>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Bengaluru, India"
              />
            </FormField>

            <FormField
              label="Skills"
              icon={Sparkles}
              marginBottom={24}
              hint="Skills drive your job matches — the more accurate, the better the recommendations."
            >
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. react — press Enter to add"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                    background: "rgba(var(--hs-a2-rgb),0.1)",
                    color: "var(--hs-a2)",
                    borderRadius: "var(--hs-r-full)",
                    padding: "0 16px",
                    fontSize: "13px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {skills.length === 0 && (
                  <p style={{ fontSize: "12px", color: "var(--hs-dim)" }}>
                    No skills yet — add some, or upload a resume to auto-extract them.
                  </p>
                )}
                {skills.map((s) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <SkillPill>{s}</SkillPill>
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      aria-label={`Remove ${s}`}
                      style={{
                        display: "grid",
                        placeItems: "center",
                        width: "18px",
                        height: "18px",
                        border: "none",
                        borderRadius: "50%",
                        background: "transparent",
                        color: "var(--hs-dim)",
                        transition: "all 0.18s var(--hs-ease)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--hs-bad)";
                        e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--hs-dim)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <X size={11} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </FormField>

            <MagneticButton
              type="submit"
              disabled={saving}
              strength={0.1}
              style={{ width: "100%", padding: "14px", fontSize: "14px" }}
            >
              <Sparkles size={15} /> {saving ? "Saving…" : "Save profile"}
            </MagneticButton>
          </form>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Profile;
