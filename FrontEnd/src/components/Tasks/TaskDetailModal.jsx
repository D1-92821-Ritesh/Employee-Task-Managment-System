import React, { useState, useMemo } from "react";
import {
  Box,
  Modal,
  Divider
} from "@mui/material";
import { USER, COMMENT } from "../../data/mockData";
import TaskHeader from "./TaskDetailModal/TaskHeader";
import TaskDetails from "./TaskDetailModal/TaskDetails";
import CommentsSection from "./TaskDetailModal/CommentsSection";

export default function TaskDetailModal({ task, open, onClose, currentUser, onTaskUpdate }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(COMMENT);

  const usersById = useMemo(() => {
    const map = new Map();
    USER.forEach((u) => map.set(u.user_id, u));
    return map;
  }, []);

  const taskComments = task ? comments.filter((c) => c.task_id === task.task_id) : [];

  const handleAddComment = () => {
    if (newComment.trim() && task) {
      const newCommentObj = {
        comment_id: Math.max(...comments.map(c => c.comment_id), 0) + 1,
        task_id: task.task_id,
        user_id: currentUser.user_id,
        content: newComment
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
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
          scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        }
        }}
      >
        {task && (
          <Box>
            <TaskHeader task={task} onClose={onClose} onMarkComplete={handleMarkComplete} />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

            <TaskDetails task={task} usersById={usersById} />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 3 }} />

            <CommentsSection
              comments={taskComments}
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
