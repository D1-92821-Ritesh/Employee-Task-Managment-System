import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { FiClock } from "react-icons/fi";
import { formatDate } from "./utils";

export default function TaskDetails({ task, usersById }) {
  return (
    <Stack spacing={2} mb={3}>
      {/* Due Date */}
      <Box display="flex" alignItems="center" gap={2}>
        <FiClock size={20} color="#64748b" />
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600' }}>
            Due Date
          </Typography>
          <Typography variant="body1" fontWeight="600">
            {formatDate(task.due_date)}
          </Typography>
        </Box>
      </Box>

      {/* Assigned To & By */}
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gap={2}
        sx={{
          bgcolor: 'rgba(0,0,0,0.3)',
          p: 2,
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600', display: 'block', mb: 0.5 }}>
            Assigned To
          </Typography>
          <Typography variant="body2" fontWeight="600">
            {task.assigned_to_name ?? usersById.get(task.assigned_to_id)?.username ?? task.assigned_to_id}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '600', display: 'block', mb: 0.5 }}>
            Assigned By
          </Typography>
          <Typography variant="body2" fontWeight="600">
            {task.assigned_by_name ?? usersById.get(task.assigned_by_id)?.username ?? task.assigned_by_id}
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
