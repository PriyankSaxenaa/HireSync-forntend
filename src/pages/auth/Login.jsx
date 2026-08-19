// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "../../api/auth.api";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/forms/AuthCard";
import { FormField, Input, PasswordInput } from "../../components/forms/FormField";
import MagneticButton from "../../components/fx/MagneticButton";
import { useAuth } from "../../hooks/useAuth";

const roleHome = {
  admin: "/admin/dashboard",
  recruiter: "/recruiter/dashboard",
  tpo: "/tpo/dashboard",
  candidate: "/candidate/dashboard",
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
      <AuthCard
        title="Welcome back"
        subtitle="Sign in and pick up exactly where you left off."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ fontWeight: 700, color: "var(--hs-a2)" }}>
              Create one
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Email" icon={Mail}>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </FormField>

          <FormField label="Password" icon={Lock} marginBottom={14}>
            <PasswordInput
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </FormField>

          <p style={{ textAlign: "right", marginBottom: "26px" }}>
            <Link to="/forgot-password" style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--hs-a2)" }}>
              Forgot password?
            </Link>
          </p>

          <MagneticButton
            type="submit"
            disabled={loading}
            strength={0.12}
            style={{ width: "100%", padding: "14px", fontSize: "15px", borderRadius: "var(--hs-r-full)" }}
          >
            {loading ? "Signing in…" : "Sign In"} <LogIn size={16} />
          </MagneticButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
