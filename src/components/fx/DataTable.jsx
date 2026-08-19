// src/components/fx/DataTable.jsx
import { motion } from "framer-motion";

/**
 * Glass data table.
 *
 * `columns` is `[{ key, header, render?, width?, align? }]`; `render(row)` wins
 * over `row[key]` when present. Rows stagger in on mount and lift on hover, and
 * the whole thing scrolls horizontally inside its own container so a wide table
 * never pushes the page sideways.
 */
const DataTable = ({ columns = [], rows = [], rowKey = "_id", empty = "Nothing to show yet.", onRowClick }) => (
  <div
    className="hs-card"
    style={{ overflowX: "auto", borderRadius: "var(--hs-r-lg)", padding: 0 }}
  >
    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: `${columns.length * 130}px` }}>
      <thead>
        <tr style={{ borderBottom: "1px solid var(--hs-line)" }}>
          {columns.map((c) => (
            <th
              key={c.key}
              style={{
                textAlign: c.align || "left",
                padding: "14px 20px",
                fontSize: "10.5px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--hs-dim)",
                whiteSpace: "nowrap",
                width: c.width,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, i) => (
          <motion.tr
            key={row[rowKey] || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.025, 0.35), duration: 0.32 }}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              cursor: onRowClick ? "pointer" : undefined,
              transition: "background 0.18s var(--hs-ease)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(var(--hs-a2-rgb),0.055)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {columns.map((c) => (
              <td
                key={c.key}
                style={{
                  padding: "14px 20px",
                  fontSize: "13px",
                  color: "var(--hs-muted)",
                  textAlign: c.align || "left",
                  verticalAlign: "middle",
                }}
              >
                {c.render ? c.render(row) : (row[c.key] ?? "—")}
              </td>
            ))}
          </motion.tr>
        ))}

        {rows.length === 0 && (
          <tr>
            <td
              colSpan={columns.length}
              style={{ padding: "44px 20px", textAlign: "center", color: "var(--hs-dim)", fontSize: "13px" }}
            >
              {empty}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default DataTable;
