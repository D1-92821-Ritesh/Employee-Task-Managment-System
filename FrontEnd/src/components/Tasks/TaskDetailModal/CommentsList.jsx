import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import CommentItem from "./CommentItem";

export default function CommentsList({ comments, usersById }) {
  if (comments.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
        No comments yet. Be the first to comment!
      </Typography>
    );
  }

  return (
    <Stack spacing={2} sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
      {comments.map((comment) => (
        <CommentItem key={comment.comment_id} comment={comment} usersById={usersById} />
      ))}
    </Stack>
  );
}
