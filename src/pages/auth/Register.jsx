// src/pages/auth/Register.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, User, ArrowLeft, ArrowRight, GraduationCap, Briefcase, School, Check } from "lucide-react";
import { sendOtp, verifyOtp, registerUser } from "../../api/auth.api";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/forms/AuthCard";
import { FormField, Input, PasswordInput } from "../../components/forms/FormField";
import OtpInput from "../../components/forms/OtpInput";
import StepRail from "../../components/forms/StepRail";
import MagneticButton from "../../components/fx/MagneticButton";

// Each option previews the palette of the workspace it unlocks.
const ROLES = [
  { key: "candidate", label: "Student", icon: GraduationCap, blurb: "Find and apply to roles" },
  { key: "recruiter", label: "Recruiter", icon: Briefcase, blurb: "Post jobs, hire talent" },
  { key: "tpo", label: "Placement cell", icon: School, blurb: "Run campus drives" },
];

const stepFade = {
  initial: { opacity: 0, x: 22 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -22 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
};

const Register = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = details
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ name: "", password: "", role: "candidate" });

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email first");
      return;
    }
    setSendingOtp(true);
    try {
      const { data } = await sendOtp(email.trim().toLowerCase());
      toast.success(data.message || "OTP sent to your email");
      setStep(2);
      setCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    setVerifying(true);
    try {
      const { data } = await verifyOtp(email.trim().toLowerCase(), otp);
      toast.success(data.message || "Email verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await registerUser({ ...form, email: email.trim().toLowerCase() });
      toast.success(data.message || "Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const subtitle = {
    1: "Let's verify your email first.",
    2: "Enter the six-digit code we just sent you.",
    3: "Almost done — finish setting up your workspace.",
  }[step];

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle={subtitle}
        width={470}
        footer={
          <>
            Already have an account?{" "}
            <Link to="/login" style={{ fontWeight: 700, color: "var(--hs-a2)" }}>
              Sign in
            </Link>
          </>
        }
      >
        <StepRail step={step} steps={["Email", "Verify", "Details"]} />

        <AnimatePresence mode="wait">
          {/* ── Step 1: email ───────────────────────────────────────────── */}
          {step === 1 && (
            <motion.form key="s1" onSubmit={handleSendOtp} {...stepFade}>
              <FormField label="Email" icon={Mail} marginBottom={26} hint="We'll send a one-time code to confirm it's you.">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </FormField>

              <MagneticButton
                type="submit"
                disabled={sendingOtp}
                strength={0.12}
                style={{ width: "100%", padding: "14px", fontSize: "15px", borderRadius: "var(--hs-r-full)" }}
              >
                {sendingOtp ? "Sending code…" : "Send verification code"} <ArrowRight size={16} />
              </MagneticButton>
            </motion.form>
          )}

          {/* ── Step 2: OTP ─────────────────────────────────────────────── */}
          {step === 2 && (
            <motion.form key="s2" onSubmit={handleVerifyOtp} {...stepFade}>
              <p style={{ textAlign: "center", fontSize: "13px", color: "var(--hs-muted)", marginBottom: "20px" }}>
                Code sent to <span style={{ color: "var(--hs-text)", fontWeight: 700 }}>{email}</span>
              </p>

              <div style={{ marginBottom: "24px" }}>
                <OtpInput value={otp} onChange={setOtp} disabled={verifying} />
              </div>

              <MagneticButton
                type="submit"
                disabled={verifying}
                strength={0.12}
                style={{ width: "100%", padding: "14px", fontSize: "15px", marginBottom: "16px", borderRadius: "var(--hs-r-full)" }}
              >
                {verifying ? "Verifying…" : "Verify code"} <Check size={16} />
              </MagneticButton>

              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={cooldown > 0 || sendingOtp}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: cooldown > 0 ? "var(--hs-dim)" : "var(--hs-a2)",
                    cursor: cooldown > 0 ? "not-allowed" : "pointer",
                  }}
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  margin: "16px auto 0",
                  border: "none",
                  background: "transparent",
                  fontSize: "12px",
                  color: "var(--hs-dim)",
                }}
              >
                <ArrowLeft size={12} /> Change email
              </button>
            </motion.form>
          )}

          {/* ── Step 3: details ─────────────────────────────────────────── */}
          {step === 3 && (
            <motion.form key="s3" onSubmit={handleRegister} {...stepFade}>
              <FormField label="Full name" icon={User}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Priyank Saxena"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  autoComplete="name"
                />
              </FormField>

              <FormField label="Email" icon={Mail}>
                <Input type="email" value={email} disabled style={{ opacity: 0.55, cursor: "not-allowed" }} />
              </FormField>

              <FormField label="Password" icon={Lock}>
                <PasswordInput
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleFormChange}
                  required
                  autoComplete="new-password"
                />
              </FormField>

              <FormField label="I am a" marginBottom={28}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "9px" }}>
                  {ROLES.map((r) => {
                    const selected = form.role === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        data-hs-role={r.key}
                        onClick={() => setForm({ ...form, role: r.key })}
                        aria-pressed={selected}
                        style={{
                          position: "relative",
                          padding: "14px 10px",
                          borderRadius: "var(--hs-r)",
                          textAlign: "center",
                          border: `1px solid ${selected ? "rgba(var(--hs-a2-rgb),0.65)" : "var(--hs-line)"}`,
                          background: selected ? "rgba(var(--hs-a2-rgb),0.12)" : "rgba(255,255,255,0.03)",
                          boxShadow: selected ? "0 0 24px rgba(var(--hs-a2-rgb),0.22)" : "none",
                          transition: "all 0.24s var(--hs-ease)",
                        }}
                      >
                        {selected && (
                          <motion.span
                            layoutId="hs-role-glow"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            style={{
                              position: "absolute",
                              inset: 0,
                              borderRadius: "var(--hs-r)",
                              background: "var(--hs-grad-soft)",
                            }}
                          />
                        )}
                        <span style={{ position: "relative" }}>
                          <r.icon
                            size={19}
                            style={{
                              color: selected ? "var(--hs-a2)" : "var(--hs-dim)",
                              marginBottom: "7px",
                            }}
                          />
                          <span
                            style={{
                              display: "block",
                              fontSize: "12px",
                              fontWeight: 800,
                              color: selected ? "var(--hs-text)" : "var(--hs-muted)",
                            }}
                          >
                            {r.label}
                          </span>
                          <span
                            style={{
                              display: "block",
                              marginTop: "2px",
                              fontSize: "9.5px",
                              lineHeight: 1.35,
                              color: "var(--hs-dim)",
                            }}
                          >
                            {r.blurb}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FormField>

              <MagneticButton
                type="submit"
                disabled={submitting}
                strength={0.12}
                style={{ width: "100%", padding: "14px", fontSize: "15px", borderRadius: "var(--hs-r-full)" }}
              >
                {submitting ? "Creating account…" : "Create account"} <ArrowRight size={16} />
              </MagneticButton>
            </motion.form>
          )}
        </AnimatePresence>
      </AuthCard>
    </AuthLayout>
  );
};

export default Register;
