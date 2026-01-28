import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Divider
} from "@mui/material";
import api, { transformComment } from "../../services/api";
import TaskHeader from "./TaskDetailModal/TaskHeader";
import TaskDetails from "./TaskDetailModal/TaskDetails";
import CommentsSection from "./TaskDetailModal/CommentsSection";

export default function TaskDetailModal({ task, open, onClose, currentUser, onTaskUpdate, usersMap }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [usersById, setUsersById] = useState(usersMap || new Map());

  // Update usersById when usersMap prop changes
  useEffect(() => {
    if (usersMap) {
      setUsersById(usersMap);
    }
  }, [usersMap]);

  // Fetch users if not provided via props (skip for employees - they don't have permission)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Skip if we already have users or if user is an employee
    if ((usersMap && usersMap.size > 0) || user.role === "EMPLOYEE") {
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        const map = new Map();
        response.data.forEach((u) => {
          // Transform user data
          const userId = u.id ?? u.user_id;
          map.set(userId, {
            user_id: userId,
            username: u.firstName || u.username,
            email: u.email,
          });
        });
        setUsersById(map);
      } catch (error) {
        console.error("Failed to fetch users in Detail Modal", error);
      }
    };
    fetchUsers();
  }, [usersMap]);

  // Get comments from task object (backend returns comments with task)
  useEffect(() => {
    if (task) {
      // Comments are already included in the task object from TaskList
      // They've been transformed by the transformTask function
      setComments(task.comments || []);
    } else {
      setComments([]);
    }
  }, [task]);

  const handleAddComment = async () => {
    if (newComment.trim() && task) {
      try {
        // Send comment in backend format (PascalCase)
        const payload = {
          Text: newComment,
          CommentedByUserId: parseInt(currentUser.user_id),
        };

        const response = await api.post(`/tasks/${task.task_id}/comments`, payload);

        // Transform the response to frontend format
        const transformedComment = transformComment(response.data);

        setComments([...comments, transformedComment]);
        setNewComment("");
      } catch (error) {
        console.error("Failed to add comment", error);
      }
    }
  };

  const handleMarkComplete = () => {
    if (task && onTaskUpdate) {
      onTaskUpdate(task.task_id, 'COMPLETED', task);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
    >
      <Box
        sx={{
          bgcolor: '#0f172a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px 0 rgba(0, 0, 0, 0.5)',
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          p: 8,
          color: 'white',
          position: 'relative',
          scrollbarWidth: "none",          // Firefox
          "&::-webkit-scrollbar": {
            display: "none",              // Chrome, Safari
          }
        }}
      >
        {task && (
          <Box>
            {/* Header Section */}
            <TaskHeader task={task} onClose={onClose} onMarkComplete={handleMarkComplete} />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

            {/* Task Details Section */}
            <TaskDetails task={task} usersById={usersById} />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />

            {/* Comments Section */}
            <CommentsSection
              comments={comments}
              usersById={usersById}
              newComment={newComment}
              onCommentChange={setNewComment}
              onAddComment={handleAddComment}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddComment();
                }
              }}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
}
