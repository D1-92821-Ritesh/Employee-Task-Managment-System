import React from "react";
import { Box, Typography } from "@mui/material";
import CommentsList from "./CommentsList";
import CommentInput from "./CommentInput";

export default function CommentsSection({
  comments,
  usersById,
  newComment,
  onCommentChange,
  onAddComment,
  onKeyDown
}) {
  return (
    <Box mb={3}>
      <Typography variant="h6" fontWeight="700" mb={2}>
        Comments ({comments.length})
      </Typography>

      {/* Comments List */}
      <Box mb={3}>
        <CommentsList comments={comments} usersById={usersById} />
      </Box>

      {/* Add Comment Input */}
      <CommentInput
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        onSubmit={onAddComment}
        onKeyDown={onKeyDown}
      />
    </Box>
  );
}
