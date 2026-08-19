// src/pages/tpo/TPOStudents.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Upload, Search, GraduationCap, CheckCircle2, AlertTriangle, Users2 } from "lucide-react";
import { getStudents, importStudents } from "../../api/tpo.api";
import CollegeGateNotice from "../../components/tpo/CollegeGateNotice";
import PageHeader from "../../components/fx/PageHeader";
import DataTable from "../../components/fx/DataTable";
import SearchField from "../../components/fx/SearchField";
import FilterChips from "../../components/fx/FilterChips";
import Modal from "../../components/fx/Modal";
import Counter from "../../components/fx/Counter";
import Loader from "../../components/fx/Loader";

const TPOStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gateStatus, setGateStatus] = useState(null); // null | "none" | "unverified"
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const fileInputRef = useRef(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await getStudents();
      setStudents(data.students || []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) setGateStatus("unverified");
      else if (status === 404) setGateStatus("none");
      else toast.error(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await importStudents(file);
      setImportSummary(data);
      toast.success(data.message || "Import complete");
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const branchOptions = useMemo(() => {
    const counts = new Map();
    students.forEach((s) => {
      if (s.branch) counts.set(s.branch, (counts.get(s.branch) || 0) + 1);
    });
    return [
      { key: "all", label: "All", count: students.length },
      ...Array.from(counts, ([key, count]) => ({ key, label: key, count })),
    ];
  }, [students]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchesBranch = branchFilter === "all" || s.branch === branchFilter;
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q);
      return matchesBranch && matchesSearch;
    });
  }, [students, search, branchFilter]);

  if (gateStatus) return <CollegeGateNotice status={gateStatus} />;

  const columns = [
    {
      key: "name",
      header: "Student",
      render: (s) => (
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              flexShrink: 0,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: "var(--hs-a2)",
            }}
          >
            <GraduationCap size={15} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: "var(--hs-text)" }}>{s.name}</p>
            <p style={{ margin: 0, fontSize: "11.5px", color: "var(--hs-dim)" }}>{s.email}</p>
          </div>
        </div>
      ),
    },
    { key: "rollNo", header: "Roll no", render: (s) => s.rollNo || "—" },
    { key: "branch", header: "Branch", render: (s) => s.branch || "—" },
    {
      key: "cgpa",
      header: "CGPA",
      render: (s) =>
        s.cgpa != null ? (
          <span style={{ fontWeight: 700, color: "var(--hs-text)", fontVariantNumeric: "tabular-nums" }}>{s.cgpa}</span>
        ) : (
          "—"
        ),
    },
    {
      key: "skills",
      header: "Skills",
      render: (s) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "260px" }}>
          {(s.skills || []).slice(0, 4).map((sk) => (
            <span key={sk} className="hs-chip" style={{ fontSize: "10px", padding: "2px 9px" }}>
              {sk}
            </span>
          ))}
          {(s.skills || []).length > 4 && (
            <span style={{ fontSize: "10.5px", color: "var(--hs-dim)", alignSelf: "center" }}>
              +{s.skills.length - 4}
            </span>
          )}
          {(s.skills || []).length === 0 && <span style={{ color: "var(--hs-dim)" }}>—</span>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Campus roster"
        icon={Users2}
        title="Students"
        liveLabel={`${students.length} ON ROSTER`}
        subtitle={
          <>
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={students.length} />
            </b>{" "}
            student{students.length === 1 ? "" : "s"} onboarded. Import a sheet to add more in bulk.
          </>
        }
        actions={
          <label
            className={uploading ? undefined : "hs-btn hs-sheen"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              borderRadius: "var(--hs-r-full)",
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#fff",
              background: uploading ? "rgba(255,255,255,0.08)" : undefined,
              border: uploading ? "1px solid var(--hs-line)" : undefined,
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            <Upload size={15} />
            {uploading ? "Importing…" : "Import Excel/CSV"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        }
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "11px", alignItems: "center" }}>
          <SearchField
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search by name, email or roll no…"
          />
        </div>
      </PageHeader>

      {branchOptions.length > 1 && (
        <FilterChips
          options={branchOptions}
          value={branchFilter}
          onChange={setBranchFilter}
          layoutId="hs-branch-pill"
          style={{ marginBottom: "20px" }}
        />
      )}

      {loading ? (
        <Loader label="Loading students" />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          empty={students.length === 0 ? "No students yet — import a sheet to get started." : "No students match your search."}
        />
      )}

      {/* ── Import summary ────────────────────────────────────────────────── */}
      <Modal
        open={Boolean(importSummary)}
        onClose={() => setImportSummary(null)}
        title="Import summary"
        subtitle="What happened to each row"
        icon={Upload}
        width={500}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px", marginBottom: "18px" }}>
          {[
            { label: "Total rows", value: importSummary?.summary?.totalRows, tone: "var(--hs-a1-rgb)" },
            { label: "Created", value: importSummary?.summary?.created, tone: "var(--hs-ok-rgb)" },
            { label: "Linked", value: importSummary?.summary?.linked, tone: "var(--hs-a3-rgb)" },
            { label: "Skipped", value: importSummary?.summary?.skipped, tone: "var(--hs-warn-rgb)" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: `rgba(${s.tone},0.08)`,
                border: `1px solid rgba(${s.tone},0.2)`,
                borderRadius: "var(--hs-r)",
                padding: "13px",
              }}
            >
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: `rgb(${s.tone})` }}>
                <Counter value={s.value ?? 0} />
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "var(--hs-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: "12.5px",
            color: "var(--hs-muted)",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            margin: 0,
          }}
        >
          <CheckCircle2 size={14} style={{ color: "var(--hs-ok)" }} />
          {importSummary?.emails?.sent || 0} credential email
          {(importSummary?.emails?.sent || 0) === 1 ? "" : "s"} sent
        </p>

        {importSummary?.summary?.errors?.length > 0 && (
          <div
            style={{
              maxHeight: "170px",
              overflowY: "auto",
              marginTop: "14px",
              padding: "12px 14px",
              borderRadius: "var(--hs-r-sm)",
              background: "rgba(var(--hs-bad-rgb),0.06)",
              border: "1px solid rgba(var(--hs-bad-rgb),0.18)",
            }}
          >
            {importSummary.summary.errors.slice(0, 10).map((e, i) => (
              <p
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "7px",
                  fontSize: "11.5px",
                  color: "var(--hs-bad)",
                  margin: "5px 0",
                  lineHeight: 1.5,
                }}
              >
                <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: "2px" }} /> Row {e.row}: {e.reason}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TPOStudents;
