// src/pages/tpo/TPOCollegeSetup.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { School, Globe, MapPin, ShieldCheck, ShieldAlert, ArrowRight, Building2 } from "lucide-react";
import { registerCollege, getCollegeById } from "../../api/college.api";
import { useAuth } from "../../hooks/useAuth";
import SpotlightCard from "../../components/fx/SpotlightCard";
import MagneticButton from "../../components/fx/MagneticButton";
import Aurora from "../../components/fx/Aurora";
import Loader from "../../components/fx/Loader";
import { FormField, Input } from "../../components/forms/FormField";

// The backend doesn't expose a "get my college" endpoint for TPOs — the
// college returned right after registration is cached locally so we can show
// a live verification status without asking an admin every time.
const CACHE_KEY = "hiresync_tpo_college";

const TPOCollegeSetup = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", address: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [college, setCollege] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const cachedTpoId = typeof parsed.tpo === "string" ? parsed.tpo : parsed.tpo?._id;

          // Defense in depth against the sessionStorage key not being
          // per-user: if the cached college belongs to a different TPO than
          // the one currently logged in (e.g. a previous account replaced by
          // a new one in the same browser tab), throw the cache away.
          if (cachedTpoId && user?.id && cachedTpoId !== user.id) {
            sessionStorage.removeItem(CACHE_KEY);
          } else {
            setCollege(parsed);
            // refresh verification status in the background
            const { data } = await getCollegeById(parsed._id);
            setCollege(data.college);
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.college));
          }
        } catch {
          // stale cache — keep showing what we had
        }
      }
      setChecking(false);
    })();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await registerCollege(form);
      toast.success(data.message || "College registered successfully");
      setCollege(data.college);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data.college));
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You have already registered a college. Refresh the dashboard to see its status.");
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) return <Loader label="Checking college status" full />;

  /* ── Registered ─────────────────────────────────────────────────────── */
  if (college) {
    const verified = Boolean(college.isVerified);
    const tone = verified ? "var(--hs-ok-rgb)" : "var(--hs-warn-rgb)";
    const Icon = verified ? ShieldCheck : ShieldAlert;

    return (
      <div style={{ maxWidth: "580px", margin: "0 auto" }}>
        <SpotlightCard hover={false} live={verified} padding={0} style={{ overflow: "hidden" }}>
          <div style={{ position: "relative", padding: "32px 32px 26px", overflow: "hidden" }}>
            <Aurora particles={false} grain={false} blobOpacity={0.4} intensity={0.7} />

            <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  flexShrink: 0,
                  borderRadius: "var(--hs-r-lg)",
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(var(--hs-a2-rgb),0.14)",
                  border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
                }}
              >
                <School size={25} style={{ color: "var(--hs-a3)" }} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h1 style={{ margin: 0, fontSize: "21px", fontWeight: 900, color: "var(--hs-text)" }}>
                  {college.name}
                </h1>
                {college.address && (
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "12.5px",
                      color: "var(--hs-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <MapPin size={12} /> {college.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ padding: "0 32px 32px" }}>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--hs-a2)",
                  marginBottom: "20px",
                }}
              >
                <Globe size={13} /> {college.website}
              </a>
            )}

            <div
              className={verified ? undefined : "hs-sheen"}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "13px",
                padding: "16px 18px",
                borderRadius: "var(--hs-r)",
                background: `rgba(${tone},0.09)`,
                border: `1px solid rgba(${tone},0.24)`,
              }}
            >
              <div style={{ position: "relative", flexShrink: 0, color: `rgb(${tone})`, display: "grid" }}>
                <Icon size={21} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13.5px",
                    fontWeight: 800,
                    color: `rgb(${tone})`,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {verified ? "Verified" : "Awaiting verification"}
                  <span className="hs-pulse-dot" style={{ width: 6, height: 6 }} />
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "12.5px", color: "var(--hs-muted)", lineHeight: 1.6 }}>
                  {verified
                    ? "Your college is verified — you can post drives freely."
                    : "An admin needs to verify your college before you can post drives."}
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    );
  }

  /* ── Registration form ──────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <SpotlightCard hover={false} live padding={34}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--hs-r-lg)",
            display: "grid",
            placeItems: "center",
            background: "rgba(var(--hs-a2-rgb),0.14)",
            border: "1px solid rgba(var(--hs-a2-rgb),0.3)",
            marginBottom: "20px",
          }}
        >
          <School size={25} style={{ color: "var(--hs-a3)" }} />
        </div>

        <h1 style={{ margin: "0 0 7px", fontSize: "22px", fontWeight: 900, color: "var(--hs-text)" }}>
          Register your college
        </h1>
        <p style={{ margin: "0 0 26px", fontSize: "13px", lineHeight: 1.65, color: "var(--hs-muted)" }}>
          One college per placement-cell account. It needs admin verification before you can post drives.
        </p>

        <form onSubmit={handleSubmit}>
          <FormField label="College name" icon={Building2}>
            <Input name="name" value={form.name} onChange={handleChange} required placeholder="Example Institute of Technology" />
          </FormField>

          <FormField label="Address" icon={MapPin}>
            <Input name="address" value={form.address} onChange={handleChange} placeholder="City, State" />
          </FormField>

          <FormField label="Website" icon={Globe} marginBottom={26}>
            <Input name="website" value={form.website} onChange={handleChange} placeholder="https://…" />
          </FormField>

          <MagneticButton
            type="submit"
            disabled={submitting}
            strength={0.1}
            style={{ width: "100%", padding: "14px", fontSize: "14px" }}
          >
            {submitting ? "Registering…" : "Register college"} <ArrowRight size={15} />
          </MagneticButton>
        </form>
      </SpotlightCard>
    </div>
  );
};

export default TPOCollegeSetup;
