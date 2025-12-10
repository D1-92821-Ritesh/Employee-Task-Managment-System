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
import { FiClock, FiUser, FiPlus } from "react-icons/fi";
import { TASK, USER } from "../../data/mockData";
import TaskDetailModal from "./TaskDetailModal";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";

const GLASS_STYLE = {
  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: "24px", // Slightly rounder for cards look better
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)", // Deeper shadow for floating card effect
  border: "1px solid rgba(255,255,255, 0.08)",
  color: "white",
  transition: "all 0.3s ease-in-out",
};

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

  const usersById = useMemo(() => new Map(USER.map(u => [u.user_id, u])), []);

  const handleTaskCreate = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleTaskUpdate = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.task_id === taskId ? { ...t, status: newStatus } : t
      )
    );
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {(currentUser.role === "ADMIN" || currentUser.role === "MANAGER") && (
              <Button
                onClick={() => setCreateTaskModalOpen(true)}
                startIcon={<FiPlus />}
                sx={{
                  background: "linear-gradient(145deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.1))",
                  color: "#a5b4fc",
                  fontWeight: "600",
                  borderRadius: "12px",
                  padding: "8px 16px",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(145deg, rgba(99, 102, 241, 0.25), rgba(99, 102, 241, 0.2))",
                    border: "1px solid rgba(99, 102, 241, 0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Create Task
              </Button>
            )}
            <Chip
              label={`${visibleTasks.length} Active Tasks`}
              sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontWeight: 'bold', border: '1px solid rgba(99, 102, 241, 0.3)' }}
            />
          </Box>
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
              <Grid item xs={12} sm={6} md={4} lg={3} key={t.task_id}>
                <TaskCard 
                  task={t} 
                  usersById={usersById} 
                  onClick={() => setSelectedTask(t)} 
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <TaskDetailModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        currentUser={currentUser}
        onTaskUpdate={handleTaskUpdate}
      />
      <CreateTaskModal
        open={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onTaskCreate={handleTaskCreate}
      />
    </Box>
  );
}