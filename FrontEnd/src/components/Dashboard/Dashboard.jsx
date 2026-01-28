/* Dashboard.jsx — Part 1 of 3
   Imports, theme styles, utility helpers, animated number hook,
   pie label renderer, and glass tooltip component.
   (Then wait for parts 2 & 3 to complete the file)
*/

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
} from "recharts";

import api, { transformTask, transformUser } from "../../services/api";

/* --------------------------------------------------------------------
   THEME: glass / compact styles (shared)
--------------------------------------------------------------------- */
const GLASS = {
  background: "linear-gradient(135deg, rgba(17,24,39,0.72), rgba(30,41,59,0.6))",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(8px)",
  boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
  color: "white",
};

const KPI_CARD = {
  ...GLASS,
  padding: "10px 12px",
  minHeight: 96,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 0.5,
  cursor: "pointer",
  transition: "transform 220ms ease, box-shadow 220ms ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
  },
};

/* --------------------------------------------------------------------
   UTILITIES
--------------------------------------------------------------------- */

/** Safe ISO parse - returns Date or null */
function parseDateStringISO(s) {
  if (!s) return null;
  try {
    // Accepts "YYYY-MM-DD" or ISO timestamp
    const d = new Date(s);
    if (isNaN(d)) return null;
    return d;
  } catch {
    return null;
  }
}

/** Simple week key grouping for timeline: "YYYY-WN" */
function weekKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const week = Math.floor(
    (Date.UTC(year, d.getMonth(), d.getDate()) -
      Date.UTC(year, 0, 1)) /
    (24 * 60 * 60 * 1000 * 7)
  );
  return `${year}-W${week}`;
}

/** Compute percentage delta between last two points */
function computeDelta(arr) {
  if (!arr || arr.length < 2) return 0;
  const last = arr[arr.length - 1].value ?? 0;
  const prev = arr[arr.length - 2].value ?? 0;
  if (prev === 0) return last === 0 ? 0 : 100;
  return Math.round(((last - prev) / Math.abs(prev)) * 100);
}

/* --------------------------------------------------------------------
   Animated number hook (small, smooth counters)
   Usage: const animated = useAnimatedNumber(target, durationMs)
--------------------------------------------------------------------- */
function useAnimatedNumber(target, duration = 600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const fromRef = useRef(0);
  const startRef = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    fromRef.current = value;
    if (duration <= 0) {
      setValue(target);
      return;
    }
    const start = performance.now();
    startRef.current = start;

    const step = (time) => {
      const t = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = Math.round(fromRef.current + (target - fromRef.current) * eased);
      setValue(v);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else rafRef.current = null;
    };

    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

/* --------------------------------------------------------------------
   Pie label renderer: draws percentage text inside slice (white)
   Used with <Pie label={renderPieLabel} labelLine={false} />
--------------------------------------------------------------------- */
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize="11"
      fontWeight="700"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

/* --------------------------------------------------------------------
   Glass-styled tooltip for Recharts (use as: <Tooltip content={<GlassTooltip/>} />)
   Appearance: semi-transparent glass, blur, border, subtle shadow
--------------------------------------------------------------------- */
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, rgba(17,24,39,0.7), rgba(17,24,39,0.55))",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        padding: "8px 12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        color: "white",
        minWidth: 140,
      }}
    >
      {label !== undefined && (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1", mb: 0.5 }}>
          {label}
        </Typography>
      )}

      {payload.map((entry, i) => {
        // Recharts payload entry usually has { name, value, payload, color }
        const name = entry.name ?? (entry.payload && entry.payload.name) ?? "";
        const val = entry.value;
        const color = entry.color ?? entry.fill ?? "#fff";

        return (
          <Box key={i} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Typography sx={{ fontSize: 13, color: "#e6eef8", fontWeight: 600 }}>
              {name ? `${name}` : ""}
            </Typography>
            <Typography sx={{ fontSize: 13, color: color, fontWeight: 700 }}>
              {val}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
/* Dashboard.jsx — Part 2 of 3
   Render helpers, KPI components, charts & admin leaderboard
*/

/* -------------------------------------------------------------
   KPI RENDERERS (with animated numbers)
------------------------------------------------------------- */

function KPITitle({ children }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1" }}>
      {children}
    </Typography>
  );
}

function KPIValue({ value }) {
  return (
    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
      {value}
    </Typography>
  );
}

function renderTotalTasksKPI(animatedMetrics) {
  return (
    <>
      <KPITitle>Total Tasks</KPITitle>
      <KPIValue value={animatedMetrics.total} />
    </>
  );
}

function renderCompletedKPI(animatedMetrics, deltaCompleted) {
  return (
    <>
      <KPITitle>Completed</KPITitle>
      <KPIValue value={animatedMetrics.completed} />
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: deltaCompleted >= 0 ? "#10b981" : "#ef4444",
        }}
      >
        {deltaCompleted >= 0 ? "+" : ""}
        {deltaCompleted}% vs last week
      </Typography>
    </>
  );
}

function renderInProgressKPI(animatedMetrics) {
  return (
    <>
      <KPITitle>In Progress</KPITitle>
      <KPIValue value={animatedMetrics.inProgress} />
    </>
  );
}

function renderOverdueKPI(animatedMetrics) {
  return (
    <>
      <KPITitle>Overdue</KPITitle>
      <KPIValue value={animatedMetrics.overdue} />
      {animatedMetrics.overdue > 0 && (
        <Typography sx={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>
          Critical — act now
        </Typography>
      )}
    </>
  );
}

/* -------------------------------------------------------------
   PIE CHART — PRIORITY
------------------------------------------------------------- */
function PriorityChart({ priorityData }) {
  return (
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Priority Distribution
      </Typography>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={priorityData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
            label={renderPieLabel}
            labelLine={false}
          >
            {priorityData.map((e, i) => (
              <Cell key={i} fill={e.fill} />
            ))}
          </Pie>
          <Legend />
          <RechartsTooltip content={<GlassTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  );
}

/* -------------------------------------------------------------
   PIE CHART — STATUS
------------------------------------------------------------- */
function StatusPieChart({ statusData }) {
  return (
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Status Breakdown
      </Typography>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={5}
            dataKey="value"
            label={renderPieLabel}
            labelLine={false}
          >
            {statusData.map((e, i) => (
              <Cell key={i} fill={e.fill} />
            ))}
          </Pie>
          <Legend />
          <RechartsTooltip content={<GlassTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  );
}

/* -------------------------------------------------------------
   BAR CHART — STATUS
------------------------------------------------------------- */
function StatusBarChart({ statusData }) {
  return (
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Tasks by Status
      </Typography>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart layout="vertical" data={statusData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={80} />
          <Bar dataKey="value" fill="#818cf8" radius={[0, 12, 12, 0]} />
          <RechartsTooltip content={<GlassTooltip />} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  );
}

/* -------------------------------------------------------------
   LINE CHART — 8 WEEK TIMELINE
------------------------------------------------------------- */
function TimelineChart({ timelineData }) {
  return (
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        8-Week Timeline
      </Typography>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="week" />
          <YAxis />
          <RechartsTooltip content={<GlassTooltip />} />

          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}

/* -------------------------------------------------------------
   SCATTER — EMPLOYEE WORKLOAD
------------------------------------------------------------- */
function WorkloadScatter({ workloadData }) {
  return (
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Workload Distribution
      </Typography>

      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis type="number" dataKey="x" name="Tasks" />
          <YAxis type="number" dataKey="y" name="Employee" />

          <RechartsTooltip content={<GlassTooltip />} />

          <Scatter data={workloadData} fill="#38bdf8" />
        </ScatterChart>
      </ResponsiveContainer>
    </CardContent>
  );
}

/* -------------------------------------------------------------
   ADMIN ONLY — TOP PERFORMERS
------------------------------------------------------------- */
function TopManagersCard({ managers }) {
  return (
    <CardContent sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Top Managers
      </Typography>

      {managers.map((m, i) => {
        const pct = m.total ? Math.round((m.completed / m.total) * 100) : 0;

        return (
          <Box
            key={i}
            sx={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              mb: 1.2,
              p: 1.2,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>{m.name}</Typography>

            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
              {m.completed}/{m.total} completed ({pct}%)
            </Typography>

            <Box
              sx={{
                height: 6,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "10px",
                mt: 1,
              }}
            >
              <Box
                sx={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #818cf8, #6366f1)",
                  borderRadius: "10px",
                }}
              />
            </Box>
          </Box>
        );
      })}
    </CardContent>
  );
}
/* -------------------------------------------------------------
   Dashboard.jsx — PART 3 of 3
   MAIN RENDER + FILTERING + KPI GRID + CHART GRID
------------------------------------------------------------- */

export default function Dashboard() {
  const navigate = useNavigate();

  /* ---------------------------------------------------------
     Load user
  --------------------------------------------------------- */
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const tasksRes = await api.get("/tasks");
        setTasks(tasksRes.data.map(transformTask));

        // Only fetch users if not an EMPLOYEE (they don't have permission)
        if (currentUser.role !== "EMPLOYEE") {
          const usersRes = await api.get("/users");
          setUsers(usersRes.data.map(transformUser));
        }
      } catch (error) {
        console.error("Dashboard fetch error", error);
      }
    };
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);


  if (!currentUser) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="white">Please login to view dashboard.</Typography>
      </Box>
    );
  }

  /* ---------------------------------------------------------
     ROLE-BASED TASK FILTERING
  --------------------------------------------------------- */
  const relevantTasks = useMemo(() => {
    const role = currentUser.role?.toUpperCase();
    const userId = currentUser.user_id;

    if (role === "ADMIN") return tasks;
    // Managers see tasks they assigned OR tasks assigned to them
    if (role === "MANAGER")
      return tasks.filter((t) =>
        String(t.assigned_by_id) === String(userId) ||
        String(t.assigned_to_id) === String(userId)
      );
    if (role === "EMPLOYEE")
      return tasks.filter((t) => String(t.assigned_to_id) === String(userId));

    return [];
  }, [currentUser, tasks]);

  /* ---------------------------------------------------------
     METRICS CALC
  --------------------------------------------------------- */
  const metrics = useMemo(() => {
    const total = relevantTasks.length;

    const completed = relevantTasks.filter((t) =>
      (t.status || "").toLowerCase().includes("complete")
    ).length;

    const inProgress = relevantTasks.filter((t) =>
      (t.status || "").toLowerCase().includes("progress")
    ).length;

    const todo = relevantTasks.filter((t) => {
      const s = (t.status || "").toLowerCase();
      return s.includes("todo") || s.includes("pending");
    }).length;

    const overdue = relevantTasks.filter((t) => {
      if (!t.due_date) return false;
      const due = parseDateStringISO(t.due_date);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return due < now && !(t.status || "").toLowerCase().includes("complete");
    }).length;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [relevantTasks]);

  /* ---------------------------------------------------------
     TIMELINE (8 weeks)
  --------------------------------------------------------- */
  const timelineData = useMemo(() => {
    const now = new Date();
    const weeks = [];

    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);
      const key = weekKey(d);
      weeks.push({ key, label: `W${weeks.length + 1}` });
    }

    const map = new Map(
      weeks.map((w) => [w.key, { week: w.label, tasks: 0, completed: 0 }])
    );

    relevantTasks.forEach((t) => {
      const d = parseDateStringISO(t.created_at || t.due_date);
      const k = weekKey(d);
      if (!map.has(k)) return;

      const entry = map.get(k);
      entry.tasks++;
      if ((t.status || "").toLowerCase().includes("complete"))
        entry.completed++;
    });

    return Array.from(map.values());
  }, [relevantTasks]);

  const sparkline = timelineData.map((d) => ({ value: d.completed }));
  const deltaCompleted = computeDelta(sparkline);

  /* ---------------------------------------------------------
     CHART DATA
  --------------------------------------------------------- */
  const priorityData = [
    {
      name: "High",
      value: relevantTasks.filter((t) => (t.priority || "").toLowerCase() === "high").length,
      fill: "#ef4444",
    },
    {
      name: "Medium",
      value: relevantTasks.filter((t) => (t.priority || "").toLowerCase() === "medium").length,
      fill: "#f97316",
    },
    {
      name: "Low",
      value: relevantTasks.filter((t) => (t.priority || "").toLowerCase() === "low").length,
      fill: "#10b981",
    },
  ];

  const statusData = [
    { name: "To Do", value: metrics.todo, fill: "#f59e0b" },
    { name: "In Progress", value: metrics.inProgress, fill: "#3b82f6" },
    { name: "Completed", value: metrics.completed, fill: "#10b981" },
    { name: "Overdue", value: metrics.overdue, fill: "#ef4444" },
  ];

  const workloadData = useMemo(() => {
    const m = new Map();

    relevantTasks.forEach((t) => {
      const id = t.assigned_to_id || "NA";
      m.set(id, (m.get(id) || 0) + 1);
    });

    return Array.from(m.entries()).map(([id, count], i) => {
      const user = users.find((u) => u.user_id === id);
      return { x: count, y: i + 1, name: user ? user.username : String(id) };
    });
  }, [relevantTasks, users]);

  /* ---------------------------------------------------------
     ADMIN - Top Managers
  --------------------------------------------------------- */
  const topManagers = useMemo(() => {
    if (currentUser.role !== "ADMIN") return [];

    return users.filter((u) => u.role === "MANAGER")
      .map((m) => {
        const mTasks = tasks.filter((t) => t.assigned_by_id === m.user_id);
        const completed = mTasks.filter((t) =>
          (t.status || "").toLowerCase().includes("complete")
        ).length;
        return { name: m.username, completed, total: mTasks.length };
      })
      .sort((a, b) => b.completed - a.completed);
  }, [currentUser, users, tasks]);

  /* ---------------------------------------------------------
     KPI CLICK → navigate & filter tasks
  --------------------------------------------------------- */
  const handleMetricClick = (filter) => {
    let statusFilter = null;

    if (filter === "COMPLETED") statusFilter = "COMPLETE";
    if (filter === "IN_PROGRESS") statusFilter = "IN_PROGRESS";
    if (filter === "OVERDUE") statusFilter = "OVERDUE";

    sessionStorage.setItem("taskFilter", statusFilter);
    window.dispatchEvent(new CustomEvent("filterTasks", { detail: { status: statusFilter } }));
    window.dispatchEvent(new CustomEvent("navigate", { detail: { selected: "tasks" } }));
  };

  /* ---------------------------------------------------------
     MAIN RENDER
  --------------------------------------------------------- */

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ------------------------------ HEADER ------------------------------ */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          ...GLASS,
          p: 2.5,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Dashboard Overview
          </Typography>

          <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
            Role: {currentUser.role.toUpperCase()}
          </Typography>
        </Box>

        <Box
          sx={{
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: "12px",
            px: 2,
            py: 1,
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>
            {metrics.total} Active Tasks
          </Typography>
        </Box>
      </Box>

      {/* ------------------------------ SCROLL AREA ------------------------------ */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: 3,
          pb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* ========================= KPI ROW ========================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 1.5,
          }}
        >
          <Card sx={KPI_CARD} onClick={() => handleMetricClick("ALL")}>
            {renderTotalTasksKPI(metrics)}
          </Card>

          <Card sx={KPI_CARD} onClick={() => handleMetricClick("COMPLETED")}>
            {renderCompletedKPI(metrics, deltaCompleted)}
          </Card>

          <Card sx={KPI_CARD} onClick={() => handleMetricClick("IN_PROGRESS")}>
            {renderInProgressKPI(metrics)}
          </Card>

          <Card sx={KPI_CARD} onClick={() => handleMetricClick("OVERDUE")}>
            {renderOverdueKPI(metrics)}
          </Card>
        </Box>

        {/* ========================= CHART ROW 1 ========================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 1.5,
          }}
        >
          <Card sx={{ ...GLASS, minHeight: 260 }}>
            <PriorityChart priorityData={priorityData} />
          </Card>

          <Card sx={{ ...GLASS, minHeight: 260 }}>
            <StatusPieChart statusData={statusData} />
          </Card>

          <Card sx={{ ...GLASS, minHeight: 260 }}>
            <StatusBarChart statusData={statusData} />
          </Card>
        </Box>

        {/* ========================= CHART ROW 2 ========================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 1.5,
          }}
        >
          <Card sx={{ ...GLASS, minHeight: 260 }}>
            <TimelineChart timelineData={timelineData} />
          </Card>

          <Card sx={{ ...GLASS, minHeight: 260 }}>
            <WorkloadScatter workloadData={workloadData} />
          </Card>

          {currentUser.role === "ADMIN" && (
            <Card sx={{ ...GLASS, minHeight: 260 }}>
              <TopManagersCard managers={topManagers} />
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------
   END OF PART 3 (FULL DASHBOARD COMPLETE)
------------------------------------------------------------- */
