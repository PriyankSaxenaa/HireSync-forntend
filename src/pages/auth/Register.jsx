// src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../api/auth.api";
import AuthLayout from "../../layouts/AuthLayout";
import { FormField, inputStyle } from "../../components/forms/FormField";

const ROLES = ["candidate", "recruiter", "tpo"];

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      toast.success(data.message || "Account created successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const focusHandlers = {
    onFocus: (e) => (e.target.style.borderColor = "#6366f1"),
    onBlur: (e) => (e.target.style.borderColor = "transparent"),
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
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
        <p style={{ margin: "8px 0 32px", fontSize: "14px", color: "#94a3b8" }}>
          Join HireSync to get started
        </p>

        <FormField label="Full Name">
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            style={inputStyle}
            {...focusHandlers}
          />
        </FormField>

        <FormField label="Email">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            style={inputStyle}
            {...focusHandlers}
          />
        </FormField>

        <FormField label="Password">
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            style={inputStyle}
            {...focusHandlers}
          />
        </FormField>

        <FormField label="I am a" marginBottom={32}>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer" }}
            {...focusHandlers}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </FormField>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "9999px",
            padding: "14px",
            fontSize: "15px",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(to right, #6366f1, #22d3ee)",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#94a3b8" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 700, color: "#818cf8" }}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;