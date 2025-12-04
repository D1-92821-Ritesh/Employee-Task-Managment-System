import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function CommentItem({ comment, usersById }) {
  return (
    <Paper
      sx={{
        bgcolor: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        p: 2,
        borderRadius: '12px'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#a5b4fc' }}>
          {usersById.get(comment.user_id)?.username ?? `User ${comment.user_id}`}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
        {comment.content}
      </Typography>
    </Paper>
  );
}
