import React from "react";
import { Box, Typography, Chip, Select, MenuItem, Button } from "@mui/material";
import { FiX, FiCheck } from "react-icons/fi";
import { getPriorityColor, getStatusColor } from "./utils";

export default function TaskHeader({ task, onClose, onStatusChange, currentUser }) {
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

          <Select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
            size="small"
            disabled={task.status === 'COMPLETED'}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#818cf8' },
              '.MuiSvgIcon-root': { color: 'white' },
              '&.Mui-disabled': { color: '#94a3b8', '-webkit-text-fill-color': '#94a3b8' },
              fontWeight: 'bold',
              borderRadius: '8px',
              bgcolor: 'rgba(0,0,0,0.2)',
              minWidth: '140px'
            }}
          >
            {task.status === "NEW" && <MenuItem value="NEW">New</MenuItem>}
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            {currentUser?.role !== "EMPLOYEE" && <MenuItem value="COMPLETED">Completed</MenuItem>}
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
