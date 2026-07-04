// src/pages/auth/Register.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp, registerUser } from "../../api/auth.api";
import AuthLayout from "../../layouts/AuthLayout";
import { FormField, inputStyle } from "../../components/forms/FormField";

const ROLES = ["candidate", "recruiter", "tpo"];

const focusHandlers = {
  onFocus: (e) => (e.target.style.borderColor = "#6366f1"),
  onBlur: (e) => (e.target.style.borderColor = "transparent"),
};

// ── Step indicator ───────────────────────────────────────────────────────────
const StepDots = ({ step }) => (
  <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        style={{
          flex: 1,
          height: "4px",
          borderRadius: "999px",
          background: n <= step ? "linear-gradient(to right,#6366f1,#22d3ee)" : "rgba(255,255,255,0.1)",
          transition: "background 0.3s",
        }}
      />
    ))}
  </div>
);

// ── 6-box OTP input ──────────────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const digits = value.split("");
    digits[i] = val;
    const next = digits.join("").slice(0, 6);
    onChange(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }} onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          maxLength={1}
          inputMode="numeric"
          style={{
            width: "44px",
            height: "52px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: 700,
            borderRadius: "10px",
            background: "#eef0ff",
            color: "#0f172a",
            border: "2px solid transparent",
            outline: "none",
          }}
          {...focusHandlers}
        />
      ))}
    </div>
  );
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

  return (
    <AuthLayout>
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#0c1120",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#fff" }}>
          Create your account
        </h1>
        <p style={{ margin: "8px 0 24px", fontSize: "14px", color: "#94a3b8" }}>
          {step === 1 && "Let's verify your email first"}
          {step === 2 && "Enter the code we just sent you"}
          {step === 3 && "Almost done — finish setting up"}
        </p>

        <StepDots step={step} />

        {/* Step 1: email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <FormField label="Email" marginBottom={28}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={inputStyle}
                {...focusHandlers}
              />
            </FormField>

            <button
              type="submit"
              disabled={sendingOtp}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "9999px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(to right, #6366f1, #22d3ee)",
                cursor: sendingOtp ? "not-allowed" : "pointer",
                opacity: sendingOtp ? 0.6 : 1,
              }}
            >
              {sendingOtp ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8", marginBottom: "18px" }}>
              Code sent to <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{email}</span>
            </p>

            <div style={{ marginBottom: "22px" }}>
              <OtpInput value={otp} onChange={setOtp} />
            </div>

            <button
              type="submit"
              disabled={verifying}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "9999px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(to right, #6366f1, #22d3ee)",
                cursor: verifying ? "not-allowed" : "pointer",
                opacity: verifying ? 0.6 : 1,
                marginBottom: "14px",
              }}
            >
              {verifying ? "Verifying..." : "Verify Code"}
            </button>

            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={cooldown > 0 || sendingOtp}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: cooldown > 0 ? "#475569" : "#818cf8",
                  cursor: cooldown > 0 ? "not-allowed" : "pointer",
                }}
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ display: "block", margin: "14px auto 0", border: "none", background: "transparent", fontSize: "12.5px", color: "#64748b", cursor: "pointer" }}
            >
              ← Change email
            </button>
          </form>
        )}

        {/* Step 3: full details */}
        {step === 3 && (
          <form onSubmit={handleRegister}>
            <FormField label="Full Name">
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleFormChange}
                required
                autoComplete="name"
                style={inputStyle}
                {...focusHandlers}
              />
            </FormField>

            <FormField label="Email">
              <input type="email" value={email} disabled style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
            </FormField>

            <FormField label="Password">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleFormChange}
                required
                autoComplete="new-password"
                style={inputStyle}
                {...focusHandlers}
              />
            </FormField>

            <FormField label="I am a" marginBottom={32}>
              <select name="role" value={form.role} onChange={handleFormChange} style={{ ...inputStyle, cursor: "pointer" }} {...focusHandlers}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </FormField>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "9999px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(to right, #6366f1, #22d3ee)",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#94a3b8" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 700, color: "#818cf8" }}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;