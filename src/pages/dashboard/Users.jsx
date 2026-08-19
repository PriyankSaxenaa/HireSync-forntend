// src/pages/dashboard/Users.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Search, Users as UsersIcon } from "lucide-react";
import { getAllUsers, deleteUser } from "../../api/admin.api";
import PageHeader from "../../components/fx/PageHeader";
import DataTable from "../../components/fx/DataTable";
import SearchField from "../../components/fx/SearchField";
import FilterChips from "../../components/fx/FilterChips";
import Counter from "../../components/fx/Counter";
import Loader from "../../components/fx/Loader";
import { initialsOf } from "../../components/common/UserMenu";

// Each role reads as its own workspace colour, matching that role's dashboard.
const ROLE_TONE = {
  admin: "var(--hs-bad-rgb)",
  recruiter: "var(--hs-warn-rgb)",
  tpo: "var(--hs-a3-rgb)",
  candidate: "var(--hs-a1-rgb)",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const roleOptions = useMemo(() => {
    const counts = users.reduce((acc, u) => {
      if (u.role) acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});
    return [
      { key: "all", label: "All", count: users.length },
      ...["admin", "recruiter", "tpo", "candidate"].map((r) => ({ key: r, label: r, count: counts[r] || 0 })),
    ];
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  if (loading) return <Loader label="Loading users" full />;

  const columns = [
    {
      key: "name",
      header: "User",
      render: (u) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              flexShrink: 0,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: "12px",
              fontWeight: 800,
              color: "#fff",
              background: "var(--hs-a2)",
            }}
          >
            {initialsOf(u.name)}
          </div>
          <span style={{ fontWeight: 700, color: "var(--hs-text)", fontSize: "13.5px" }}>{u.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (u) => {
        const tone = ROLE_TONE[u.role] || "148,163,184";
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "var(--hs-r-full)",
              fontSize: "11.5px",
              fontWeight: 700,
              textTransform: "capitalize",
              color: `rgb(${tone})`,
              background: `rgba(${tone},0.12)`,
              border: `1px solid rgba(${tone},0.28)`,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
            {u.role}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        <button
          onClick={() => handleDelete(u._id, u.name)}
          disabled={deletingId === u._id}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            border: "1px solid rgba(var(--hs-bad-rgb),0.28)",
            background: "transparent",
            color: "var(--hs-bad)",
            padding: "7px 14px",
            borderRadius: "var(--hs-r-full)",
            fontSize: "12px",
            fontWeight: 700,
            cursor: deletingId === u._id ? "not-allowed" : "pointer",
            opacity: deletingId === u._id ? 0.5 : 1,
            transition: "background 0.2s var(--hs-ease)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-bad-rgb),0.13)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Trash2 size={13} />
          {deletingId === u._id ? "Deleting…" : "Delete"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Directory"
        icon={UsersIcon}
        title="Users"
        liveLabel={`${users.length} ACCOUNTS`}
        subtitle={
          <>
            Showing{" "}
            <b style={{ color: "var(--hs-text)" }}>
              <Counter value={filtered.length} />
            </b>{" "}
            of {users.length} account{users.length === 1 ? "" : "s"}.
          </>
        }
      >
        <SearchField
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search by name or email…"
        />
      </PageHeader>

      <FilterChips
        options={roleOptions}
        value={roleFilter}
        onChange={setRoleFilter}
        layoutId="hs-role-filter-pill"
        style={{ marginBottom: "20px" }}
      />

      <DataTable columns={columns} rows={filtered} empty="No users match your search." />
    </div>
  );
};

export default Users;
