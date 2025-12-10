import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider
} from "@mui/material";
import { FiClock, FiUser } from "react-icons/fi";
import { TASK, USER } from "../../data/mockData";
import TaskDetailModal from "./TaskDetailModal";

const GLASS_STYLE = {
  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: "24px", // Slightly rounder for cards look better
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)", // Deeper shadow for floating card effect
  border: "1px solid rgba(255,255,255, 0.08)",
  color: "white",
  transition: "all 0.3s ease-in-out",
};

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

  const usersById = useMemo(() => new Map(USER.map(u => [u.user_id, u])), []);

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

    return byRole.filter((t) => isActiveStatus(t.status));
  }, [currentUser, tasks]);

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
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '0.5px' }}>
              Task Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiUser /> Role: <strong>{currentUser.role}</strong>
            </Typography>
          </Box>
          <Chip
            label={`${visibleTasks.length} Active Tasks`}
            sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontWeight: 'bold', border: '1px solid rgba(99, 102, 241, 0.3)' }}
          />
        </CardContent>
      </Card>

      <Box
        sx={{
          p: 2,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '10px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(99, 102, 241, 0.5)',
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
          <Grid container spacing={3} sx={{ p: 1 }}>
            {visibleTasks.map((t) => (
              (() => {
                const assignedName = usersById.get(t.assigned_to_id)?.username ?? t.assigned_to_id;
                const assignerName = usersById.get(t.assigned_by_id)?.username ?? t.assigned_by_id;
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={t.task_id} sx={{ display: 'flex' }}>
                    <Card
                      onClick={() => setSelectedTask(t)}
                      sx={{
                        ...GLASS_STYLE,
                        width: '280px',
                        height: '320px',
                        minWidth: '280px',
                        maxWidth: '280px',
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

                        <Stack spacing={1.5} flexShrink={0}>
                          {/* Date */}
                          <Box display="flex" alignItems="center" gap={1} color="#94a3b8">
                            <FiClock size={16} />
                            <Typography variant="body2" fontWeight="500" fontSize="0.875rem">
                              Due: {formatDate(t.due_date)}
                            </Typography>
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor="rgba(0,0,0,0.2)" p={1.25} borderRadius="12px">
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
                  </Grid>
                );
              })()
            ))}
          </Grid>
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
    </Box>
  );
}