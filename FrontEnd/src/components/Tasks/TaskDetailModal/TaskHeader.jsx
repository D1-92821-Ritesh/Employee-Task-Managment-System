import React from "react";
import { Box, Typography, Chip, Button } from "@mui/material";
import { FiX, FiCheck } from "react-icons/fi";
import { getPriorityColor, getStatusColor } from "./utils";

export default function TaskHeader({ task, onClose, onMarkComplete }) {
  const isCompleted = task.status.toLowerCase() === 'completed';

  return (
    <Box mb={3}>
      {/* Close Button */}
      <Button
        onClick={onClose}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          minWidth: 'auto',
          color: '#94a3b8',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
        }}
      >
        <FiX size={24} />
      </Button>

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
            {task.title}
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', mb: 2 }}>
            {task.description}
          </Typography>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-end" alignItems="center">
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority)}
            sx={{ fontWeight: 'bold', borderRadius: '8px' }}
          />
          <Chip
            label={task.status}
            color={getStatusColor(task.status)}
            variant="outlined"
            sx={{ fontWeight: 'bold', borderRadius: '8px', bgcolor: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
          {!isCompleted && (
            <Button
              variant="contained"
              startIcon={<FiCheck />}
              onClick={onMarkComplete}
              sx={{
                bgcolor: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.5)',
                '&:hover': {
                  bgcolor: 'rgba(34, 197, 94, 0.3)',
                  borderColor: '#22c55e'
                }
              }}
            >
              Mark Complete
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
