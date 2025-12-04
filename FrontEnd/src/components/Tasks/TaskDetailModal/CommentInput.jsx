import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { FiSend } from "react-icons/fi";

export default function CommentInput({ value, onChange, onSubmit, onKeyDown }) {
  return (
    <Box display="flex" gap={1}>
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Add a comment..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            '&:hover fieldset': {
              borderColor: 'rgba(255,255,255,0.2)'
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.5)'
            }
          },
          '& .MuiOutlinedInput-input::placeholder': {
            color: '#64748b',
            opacity: 1
          }
        }}
      />
      <Button
        onClick={onSubmit}
        disabled={!value.trim()}
        sx={{
          bgcolor: 'rgba(99, 102, 241, 0.8)',
          color: 'white',
          borderRadius: '12px',
          fontWeight: '600',
          px: 3,
          '&:hover': {
            bgcolor: 'rgba(99, 102, 241, 1)',
          },
          '&:disabled': {
            bgcolor: 'rgba(99, 102, 241, 0.3)',
            color: '#94a3b8'
          }
        }}
      >
        <FiSend size={18} />
      </Button>
    </Box>
  );
}
