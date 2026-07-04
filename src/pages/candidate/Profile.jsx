// src/pages/candidate/Profile.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { UploadCloud, FileText, MapPin, Sparkles, X, CheckCircle2 } from "lucide-react";
import GlowCard from "../../components/candidate/GlowCard";
import SkillPill from "../../components/candidate/SkillPill";
import { getMyProfile, updateMyProfile } from "../../api/candidate.api";
import { uploadResume } from "../../api/resume.api";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  padding: "11px 14px",
  fontSize: "14px",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  border: "1px solid rgba(216,180,254,0.15)",
  outline: "none",
};

const labelStyle = { display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.03em", color: "#a897c9" };

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
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

  if (loading) return <p style={{ color: "#a897c9" }}>Loading profile...</p>;

  const complete = !!(profile?.resumeUrl && skills.length);

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "22px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#fff" }}>My Profile</h1>
        <p style={{ margin: "6px 0 0", fontSize: "13.5px", color: "#a897c9" }}>{profile?.email}</p>
      </div>

      {/* Resume upload */}
      <GlowCard style={{ padding: "24px", marginBottom: "20px" }} hoverLift={false}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={16} color="#c4b5fd" /> Resume
          </h3>
          {complete && (
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, color: "#6ee7b7", background: "rgba(52,211,153,0.12)", padding: "4px 10px", borderRadius: "999px" }}>
              <CheckCircle2 size={12} /> Complete
            </span>
          )}
        </div>

        {profile?.resumeUrl && (
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#93c5fd", textDecoration: "none", marginBottom: "16px" }}>
            <FileText size={14} /> View current resume
          </a>
        )}

        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} id="resume-upload" />
        <motion.label
          htmlFor="resume-upload"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            border: "1.5px dashed rgba(216,180,254,0.3)", borderRadius: "14px", padding: "26px",
            cursor: uploading ? "not-allowed" : "pointer", color: "#c4b5fd", fontSize: "13px", fontWeight: 600,
            background: "rgba(139,92,246,0.05)",
          }}
        >
          <UploadCloud size={18} />
          {uploading ? "Uploading & parsing..." : profile?.resumeUrl ? "Upload a new resume (PDF)" : "Upload your resume (PDF, max 5MB)"}
        </motion.label>
      </GlowCard>

      {/* Profile details */}
      <GlowCard style={{ padding: "24px" }} hoverLift={false}>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Location</label>
            <div style={{ position: "relative" }}>
              <MapPin size={15} color="#7c6f93" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input style={{ ...inputStyle, paddingLeft: "36px" }} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bengaluru, India" />
            </div>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label style={labelStyle}>Skills</label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              <input
                style={inputStyle}
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
              <button type="button" onClick={addSkill} style={{ border: "1px solid rgba(216,180,254,0.2)", background: "transparent", color: "#c4b5fd", borderRadius: "10px", padding: "0 16px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skills.length === 0 && <p style={{ fontSize: "12px", color: "#7c6f93" }}>No skills yet — add some or upload a resume to auto-extract them.</p>}
              {skills.map((s) => (
                <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <SkillPill>{s}</SkillPill>
                  <button type="button" onClick={() => removeSkill(s)} style={{ border: "none", background: "transparent", color: "#fda4af", cursor: "pointer", padding: 0, marginLeft: "-4px" }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            style={{
              width: "100%", border: "none", borderRadius: "12px", padding: "13px", fontSize: "14px", fontWeight: 700,
              color: "#fff", background: "linear-gradient(to right,#8b5cf6,#d946ef)",
              cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <Sparkles size={15} /> {saving ? "Saving..." : "Save Profile"}
          </motion.button>
        </form>
      </GlowCard>
    </div>
  );
};

export default Profile;