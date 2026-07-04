// src/pages/auth/Login.jsx
// ── ONLY CHANGE FROM YOUR EXISTING FILE ──────────────────────────────────────
// roleHome.tpo now points to "/tpo/dashboard" instead of "/", so TPOs land
// straight on their new dashboard after logging in.
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../api/auth.api";
import AuthLayout from "../../layouts/AuthLayout";
import { FormField, inputStyle } from "../../components/forms/FormField";
import { useAuth } from "../../hooks/useAuth";

const roleHome = {
  admin: "/admin/dashboard",
  recruiter: "/recruiter/dashboard",
  tpo: "/tpo/dashboard",
  candidate: "/",
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      toast.success(data.message || "Logged in successfully");
      login(data.user); // populate AuthContext + sessionStorage
      navigate(roleHome[data.user.role] || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
          Welcome back
        </h1>
        <p style={{ margin: "8px 0 32px", fontSize: "14px", color: "#94a3b8" }}>
          Sign in to your account
        </p>

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
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "transparent")}
          />
        </FormField>

        <FormField label="Password" marginBottom={32}>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e) => (e.target.style.borderColor = "transparent")}
          />
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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#94a3b8" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ fontWeight: 700, color: "#818cf8" }}>
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;