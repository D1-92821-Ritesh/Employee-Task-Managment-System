import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Modal,
  Divider
} from "@mui/material";
import api from "../../services/api";
import TaskHeader from "./TaskDetailModal/TaskHeader";
import TaskDetails from "./TaskDetailModal/TaskDetails";
import CommentsSection from "./TaskDetailModal/CommentsSection";

export default function TaskDetailModal({ task, open, onClose, currentUser, onTaskUpdate }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [usersById, setUsersById] = useState(new Map());

  // Fetch users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        const map = new Map();
        response.data.forEach((u) => map.set(u.user_id, u));
        setUsersById(map);
      } catch (error) {
        console.error("Failed to fetch users in Detail Modal", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch comments when task changes
  useEffect(() => {
    if (task) {
      const fetchComments = async () => {
        try {
          const response = await api.get(`/tasks/${task.task_id}/comments`);
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments", error);
        }
      };
      fetchComments();
    } else {
      setComments([]);
    }
  }, [task]);

  const handleAddComment = async () => {
    if (newComment.trim() && task) {
      try {
        const payload = {
          content: newComment,
          user_id: currentUser.user_id,
          task_id: task.task_id
        };
        const response = await api.post(`/tasks/${task.task_id}/comments`, payload);

        // Optimistically add or fetch again. Using response data assuming it returns the comment.
        setComments([...comments, response.data]);
        setNewComment("");
      } catch (error) {
        console.error("Failed to add comment", error);
      }
    }
  };

  const handleMarkComplete = () => {
    if (task && onTaskUpdate) {
      onTaskUpdate(task.task_id, 'completed');
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
