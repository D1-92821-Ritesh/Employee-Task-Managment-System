import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  Button
} from "@mui/material";
import { FiClock, FiUser, FiPlus, FiX } from "react-icons/fi";
import { TASK, USER } from "../../data/mockData";
import TaskDetailModal from "./TaskDetailModal";
import CreateTaskModal from "./CreateTaskModal";

// --- THEME STYLES (The "Glass" Look) ---
// Applied to both the Header and the individual Cards
const GLASS_STYLE = {
  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: "24px", // Slightly rounder for cards look better
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)", // Deeper shadow for floating card effect
  border: "1px solid rgba(255,255,255, 0.08)",
  color: "white",
  transition: "all 0.3s ease-in-out",
};

// --- HELPERS ---
const getStatusColor = (status) => {
  if (!status) return "default";
  // normalize common variants (remove spaces/underscores)
  const s = String(status).toLowerCase().replace(/[_\s-]/g, "");
  if (s.includes("complete") || s.includes("done")) return "success";
  if (s.includes("inprogress") || s.includes("progress")) return "info";
  if (s.includes("todo") || s.includes("new") || s.includes("pending")) return "warning";
  if (s.includes("cancel") || s.includes("closed")) return "default";
  return "default";
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "success";
    default: return "default";
  }
};

function formatDate(dt) {
  if (!dt) return "-";
  return dt.split(" ")[0];
}

export default function TaskList() {
  const [currentUser, _setCurrentUser] = useState(() => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState(TASK);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);

  const usersById = useMemo(() => new Map(USER.map(u => [u.user_id, u])), []);

  // Listen for filter events from Dashboard
  React.useEffect(() => {
    const handleFilterTasks = (event) => {
      const { status } = event.detail;
      setStatusFilter(status);
    };

    window.addEventListener("filterTasks", handleFilterTasks);
    
    // Check for stored filter on mount
    const storedFilter = sessionStorage.getItem("taskFilter");
    if (storedFilter) {
      setStatusFilter(storedFilter);
      sessionStorage.removeItem("taskFilter");
    }

    return () => window.removeEventListener("filterTasks", handleFilterTasks);
  }, []);

  const handleTaskCreate = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskUpdate = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.task_id === taskId ? { ...t, status: newStatus } : t
      )
    );
    // Update selected task if it's open
    if (selectedTask?.task_id === taskId) {
      setSelectedTask(prev => ({ ...prev, status: newStatus }));
    }
  };

  const visibleTasks = useMemo(() => {
    if (!currentUser) return [];
    const role = (currentUser.role || "").toUpperCase();
    // helper: treat anything containing completion keywords as inactive
    const isActiveStatus = (status) => {
      if (!status) return false;
      const s = String(status).toLowerCase();
      // exclude completed/done/closed/cancelled statuses
      if (s.includes("complete") || s.includes("done") || s.includes("closed") || s.includes("cancel")) return false;
      return true;
    };

    const byRole =
      role === "ADMIN"
        ? tasks
        : role === "MANAGER"
          ? tasks.filter((t) => t.assigned_by_id === currentUser.user_id)
          : role === "EMPLOYEE"
            ? tasks.filter((t) => t.assigned_to_id === currentUser.user_id)
            : [];

    // Apply status filter if one is selected from Dashboard
    let filtered = byRole;
    if (statusFilter === "COMPLETE") {
      filtered = filtered.filter((t) => (t.status || "").toUpperCase().includes("COMPLETE"));
    } else if (statusFilter === "IN_PROGRESS") {
      filtered = filtered.filter((t) => (t.status || "").toUpperCase().includes("IN_PROGRESS"));
    } else if (statusFilter === "OVERDUE") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((t) => {
        if (!t.due_date) return false;
        const due = new Date(t.due_date);
        return due < today && !isActiveStatus(t.status);
      });
    } else if (statusFilter === null) {
      // Default: Only return active tasks
      filtered = byRole.filter((t) => isActiveStatus(t.status));
    }

    return filtered;
  }, [currentUser, tasks, statusFilter]);

  if (!currentUser) return <Typography sx={{ p: 3, color: 'white' }}>Please login.</Typography>;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      padding: '25px'
    }}>

      {/* --- GLASS 1: THE HEADER --- */}
      <Card
        sx={{
          ...GLASS_STYLE,
          mb: 3,
          p: 1,
          flexShrink: 0,
        }}
      >
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '0.5px' }}>
              Task Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiUser /> Role: <strong>{currentUser.role}</strong>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {(currentUser.role === "ADMIN" || currentUser.role === "MANAGER") && (
              <Button
                onClick={() => setCreateTaskModalOpen(true)}
                sx={{
                  background: "linear-gradient(145deg, rgba(129, 140, 248, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)",
                  color: "#a5b4fc",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  borderRadius: "12px",
                  padding: "10px 18px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: "140px",
                  justifyContent: "center",
                  border: "1px solid rgba(165, 180, 252, 0.3)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(145deg, rgba(129, 140, 248, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)",
                    border: "1px solid rgba(165, 180, 252, 0.5)",
                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                <FiPlus size={18} />
                Create Task
              </Button>
            )}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              {/* Filter Status Indicator */}
              {statusFilter && (
                <Box
                  sx={{
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.15))",
                    border: "1px solid rgba(139, 92, 246, 0.4)",
                    borderRadius: "10px",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    backdropFilter: "blur(10px)",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#c4b5fd",
                  }}
                >
                  <Box sx={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8" }} />
                  Filtered: {statusFilter === "COMPLETE" ? "Completed" : statusFilter === "IN_PROGRESS" ? "In Progress" : statusFilter === "OVERDUE" ? "Overdue" : statusFilter}
                  <Button
                    onClick={() => setStatusFilter(null)}
                    sx={{
                      minWidth: "auto",
                      padding: "2px 4px",
                      marginLeft: "4px",
                      color: "#c4b5fd",
                      "&:hover": {
                        background: "rgba(139, 92, 246, 0.3)",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <FiX size={14} />
                  </Button>
                </Box>
              )}
              <Chip
                label={`${visibleTasks.length} ${statusFilter ? "Results" : "Active Tasks"}`}
                sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontWeight: 'bold', border: '1px solid rgba(99, 102, 241, 0.3)' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 3,
          pb: 2,
          alignItems: "center",
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Typography sx={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8", letterSpacing: "0.5px" }}>
          STATUS FILTERS
        </Typography>
        <Button
          onClick={() => setStatusFilter(null)}
          sx={{
            background: statusFilter === null ? "rgba(99, 102, 241, 0.25)" : "rgba(99, 102, 241, 0.08)",
            border: statusFilter === null ? "1px solid rgba(99, 102, 241, 0.6)" : "1px solid rgba(99, 102, 241, 0.2)",
            color: statusFilter === null ? "#a5b4fc" : "#cbd5e1",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "6px 14px",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(99, 102, 241, 0.2)",
              borderColor: "rgba(99, 102, 241, 0.5)",
            },
          }}
        >
          All Tasks
        </Button>
        <Button
          onClick={() => setStatusFilter("IN_PROGRESS")}
          sx={{
            background: statusFilter === "IN_PROGRESS" ? "rgba(59, 130, 246, 0.25)" : "rgba(59, 130, 246, 0.08)",
            border: statusFilter === "IN_PROGRESS" ? "1px solid rgba(59, 130, 246, 0.6)" : "1px solid rgba(59, 130, 246, 0.2)",
            color: statusFilter === "IN_PROGRESS" ? "#60a5fa" : "#cbd5e1",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "6px 14px",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 0.5)",
            },
          }}
        >
          In Progress
        </Button>
        <Button
          onClick={() => setStatusFilter("COMPLETE")}
          sx={{
            background: statusFilter === "COMPLETE" ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.08)",
            border: statusFilter === "COMPLETE" ? "1px solid rgba(16, 185, 129, 0.6)" : "1px solid rgba(16, 185, 129, 0.2)",
            color: statusFilter === "COMPLETE" ? "#6ee7b7" : "#cbd5e1",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "6px 14px",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(16, 185, 129, 0.2)",
              borderColor: "rgba(16, 185, 129, 0.5)",
            },
          }}
        >
          Completed
        </Button>
        <Button
          onClick={() => setStatusFilter("OVERDUE")}
          sx={{
            background: statusFilter === "OVERDUE" ? "rgba(239, 68, 68, 0.25)" : "rgba(239, 68, 68, 0.08)",
            border: statusFilter === "OVERDUE" ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(239, 68, 68, 0.2)",
            color: statusFilter === "OVERDUE" ? "#fca5a5" : "#cbd5e1",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "8px",
            padding: "6px 14px",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(239, 68, 68, 0.2)",
              borderColor: "rgba(239, 68, 68, 0.5)",
            },
          }}
        >
          Overdue
        </Button>
      </Box>
      <Box
        sx={{
          p: 2,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(99, 102, 241, 0.4)',
            borderRadius: '10px',
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.7)',
            },
          },
        }}
      >
        {visibleTasks.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Card sx={{ ...GLASS_STYLE, p: 3 }}>
              <Typography variant="h6">No active tasks</Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
                There are no active tasks for your role right now.
              </Typography>
            </Card>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 2,
              p: 0,
              justifyContent: 'center',
            }}
          >
            {visibleTasks.map((t) => (
              (() => {
                const assignedName = usersById.get(t.assigned_to_id)?.username ?? t.assigned_to_id;
                const assignerName = usersById.get(t.assigned_by_id)?.username ?? t.assigned_by_id;
                return (
                  <Box key={t.task_id} sx={{ display: 'flex' }}>
                    {/* --- INDIVIDUAL GLASS CARD --- */}
                    <Card
                      onClick={() => setSelectedTask(t)}
                      sx={{
                        ...GLASS_STYLE,
                        width: '100%',
                        height: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: "pointer",
                        transition: 'all 0.3s ease',
                        "&:hover": {
                          transform: "translateY(-8px)", // Lift up effect
                          boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.4)",
                          background: "linear-gradient(145deg, #1e293b 0%, #253346 100%)",
                        }
                      }}
                    >

                      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                        {/* Top Row: Priority & Status Chips */}
                        <Box display="flex" justifyContent="space-between" mb={1.5} flexShrink={0}>
                          <Chip
                            label={t.priority}
                            size="small"
                            color={getPriorityColor(t.priority)}
                            sx={{ fontWeight: 'bold', borderRadius: '8px', fontSize: '0.75rem' }}
                          />
                          <Chip
                            label={t.status}
                            size="small"
                            color={getStatusColor(t.status)}
                            variant="outlined"
                            sx={{ fontWeight: 'bold', borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.75rem' }}
                          />
                        </Box>

                        {/* Main Title */}
                        <Typography 
                          variant="h6" 
                          fontWeight="700" 
                          sx={{ 
                            mb: 1.5,
                            lineHeight: 1.3,
                            height: '3.9rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: '1.1rem',
                            flexShrink: 0
                          }}
                        >
                          {t.title}
                        </Typography>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1.5, flexShrink: 0 }} />

                        {/* Bottom Section: Meta Details */}
                        <Stack spacing={1.5} flexShrink={0}>
                          {/* Date */}
                          <Box display="flex" alignItems="center" gap={1} color="#94a3b8">
                            <FiClock size={16} />
                            <Typography variant="body2" fontWeight="500" fontSize="0.875rem">
                              Due: {formatDate(t.due_date)}
                            </Typography>
                          </Box>

                          {/* People (Assigned To -> Assigned By) */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor="rgba(0,0,0,0.2)" p={1.25} borderRadius="12px">
                            {/* To */}
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box>
                                <Typography variant="caption" display="block" color="#64748b" lineHeight={1} fontSize="0.7rem">To</Typography>
                                <Typography variant="body2" fontWeight="600" fontSize="0.875rem" sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100px'
                                }}>{assignedName}</Typography>
                              </Box>
                            </Box>

                            {/* By */}
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box textAlign="right">
                                <Typography variant="caption" display="block" color="#64748b" lineHeight={1} fontSize="0.7rem">By</Typography>
                                <Typography variant="body2" fontWeight="600" fontSize="0.875rem" sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100px'
                                }}>{assignerName}</Typography>
                              </Box>

                            </Box>
                          </Box>
                        </Stack>

                      </CardContent>
                    </Card>
                  </Box>
                );
              })()
            ))}
          </Box>
        )}
      </Box>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        currentUser={currentUser}
        onTaskUpdate={handleTaskUpdate}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onTaskCreate={handleTaskCreate}
      />
    </Box>
  );
}