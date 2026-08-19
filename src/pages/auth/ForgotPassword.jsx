// src/pages/auth/ForgotPassword.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowLeft, ArrowRight, Check, KeyRound } from "lucide-react";
import { sendForgotPasswordOtp, verifyForgotPasswordOtp, resetPassword } from "../../api/auth.api";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/forms/AuthCard";
import { FormField, Input, PasswordInput } from "../../components/forms/FormField";
import OtpInput from "../../components/forms/OtpInput";
import StepRail from "../../components/forms/StepRail";
import MagneticButton from "../../components/fx/MagneticButton";

const stepFade = {
  initial: { opacity: 0, x: 22 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -22 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
};

// Cheap strength read-out — length plus character-class variety.
const scorePassword = (pw = "") => {
  if (!pw) return 0;
  let score = Math.min(pw.length / 12, 1) * 55;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 15;
  if (/\d/.test(pw)) score += 15;
  if (/[^A-Za-z0-9]/.test(pw)) score += 15;
  return Math.min(Math.round(score), 100);
};

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp, 3 = new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });

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
      const { data } = await sendForgotPasswordOtp(email.trim().toLowerCase());
      toast.success(data.message || "Reset code sent to your email");
      setStep(2);
      setCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
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
      const { data } = await verifyForgotPasswordOtp(email.trim().toLowerCase(), otp);
      toast.success(data.message || "Code verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    } finally {
      setVerifying(false);
    }
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await resetPassword(email.trim().toLowerCase(), form.newPassword);
      toast.success(data.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  const strength = scorePassword(form.newPassword);
  const strengthLabel = strength > 75 ? "Strong" : strength > 45 ? "Decent" : "Weak";
  const strengthTone = strength > 75 ? "var(--hs-ok)" : strength > 45 ? "var(--hs-warn)" : "var(--hs-bad)";
  const mismatch = form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword;

  const subtitle = {
    1: "Enter the email linked to your account.",
    2: "Enter the six-digit code we just sent you.",
    3: "Choose a new password.",
  }[step];

  return (
    <AuthLayout>
      <AuthCard
        title="Reset your password"
        subtitle={subtitle}
        footer={
          <>
            Remembered it?{" "}
            <Link to="/login" style={{ fontWeight: 700, color: "var(--hs-a2)" }}>
              Back to login
            </Link>
          </>
        }
      >
        <StepRail step={step} steps={["Email", "Verify", "Reset"]} />

        <AnimatePresence mode="wait">
          {/* ── Step 1: email ───────────────────────────────────────────── */}
          {step === 1 && (
            <motion.form key="s1" onSubmit={handleSendOtp} {...stepFade}>
              <FormField label="Email" icon={Mail} marginBottom={26}>
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
                {sendingOtp ? "Sending code…" : "Send reset code"} <ArrowRight size={16} />
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

          {/* ── Step 3: new password ────────────────────────────────────── */}
          {step === 3 && (
            <motion.form key="s3" onSubmit={handleResetPassword} {...stepFade}>
              <FormField label="New password" icon={Lock} marginBottom={14}>
                <PasswordInput
                  name="newPassword"
                  placeholder="••••••••"
                  value={form.newPassword}
                  onChange={handleFormChange}
                  required
                  autoComplete="new-password"
                />
              </FormField>

              {/* Strength meter — fills and re-tints as you type */}
              {form.newPassword && (
                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      height: "4px",
                      borderRadius: "var(--hs-r-full)",
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      animate={{ width: `${strength}%` }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: "100%", borderRadius: "inherit", background: strengthTone }}
                    />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: "11px", fontWeight: 700, color: strengthTone }}>
                    {strengthLabel} password
                  </p>
                </div>
              )}

              <FormField
                label="Confirm new password"
                icon={KeyRound}
                marginBottom={28}
                error={mismatch ? "Passwords don't match yet." : undefined}
              >
                <PasswordInput
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleFormChange}
                  required
                  autoComplete="new-password"
                />
              </FormField>

              <MagneticButton
                type="submit"
                disabled={submitting}
                strength={0.12}
                style={{ width: "100%", padding: "14px", fontSize: "15px", borderRadius: "var(--hs-r-full)" }}
              >
                {submitting ? "Resetting…" : "Reset password"} <Check size={16} />
              </MagneticButton>
            </motion.form>
          )}
        </AnimatePresence>
      </AuthCard>
    </AuthLayout>
  );
};

export default ForgotPassword;
