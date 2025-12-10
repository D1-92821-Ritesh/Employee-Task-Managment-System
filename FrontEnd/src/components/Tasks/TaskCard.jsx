import React from "react";
import { Box, Card, CardContent, Typography, Chip, Divider, Stack } from "@mui/material";
import { FiClock } from "react-icons/fi";

const GLASS_STYLE = {
  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: "24px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255,255,255, 0.08)",
  color: "white",
  transition: "all 0.3s ease-in-out",
};

const getStatusColor = (status) => {
  if (!status) return "default";
  const s = String(status).toLowerCase().replace(/[_\s-]/g, "");
  if (s.includes("complete") || s.includes("done")) return "success";
  if (s.includes("inprogress") || s.includes("progress")) return "info";
  if (s.includes("todo") || s.includes("new") || s.includes("pending")) return "warning";
  if (s.includes("cancel") || s.includes("closed")) return "default";
  return "default";
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high": return "error";
    case "medium": return "warning";
    case "low": return "success";
    default: return "default";
  }
};

function formatDate(dt) {
  if (!dt) return "-";
  return dt.split(" ")[0];
}

export default function TaskCard({ task, usersById, onClick }) {
  const assignedName = usersById.get(task.assigned_to_id)?.username ?? task.assigned_to_id;
  const assignerName = usersById.get(task.assigned_by_id)?.username ?? task.assigned_by_id;

  return (
    <Box sx={{ display: "flex" }}>
      <Card
        onClick={onClick}
        sx={{
          ...GLASS_STYLE,
          width: "100%",
          height: "320px",
          minWidth: "280px",
          maxWidth: "280px",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.4)",
            background: "linear-gradient(145deg, #1e293b 0%, #253346 100%)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={1.5} flexShrink={0}>
            <Chip
              label={task.priority}
              size="small"
              color={getPriorityColor(task.priority)}
              sx={{ fontWeight: "bold", borderRadius: "8px", fontSize: "0.75rem" }}
            />
            <Chip
              label={task.status}
              size="small"
              color={getStatusColor(task.status)}
              variant="outlined"
              sx={{
                fontWeight: "bold",
                borderRadius: "8px",
                bgcolor: "rgba(0,0,0,0.2)",
                color: "white",
                fontSize: "0.75rem",
              }}
            />
          </Box>

          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              mb: 1.5,
              lineHeight: 1.3,
              height: "3.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            {task.title}
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1.5, flexShrink: 0 }} />

          <Stack spacing={1.5} flexShrink={0}>
            <Box display="flex" alignItems="center" gap={1} color="#94a3b8">
              <FiClock size={16} />
              <Typography variant="body2" fontWeight="500" fontSize="0.875rem">
                Due: {formatDate(task.due_date)}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="rgba(0,0,0,0.2)"
              p={1.25}
              borderRadius="12px"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box>
                  <Typography
                    variant="caption"
                    display="block"
                    color="#64748b"
                    lineHeight={1}
                    fontSize="0.7rem"
                  >
                    To
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    fontSize="0.875rem"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100px",
                    }}
                  >
                    {assignedName}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Box textAlign="right">
                  <Typography
                    variant="caption"
                    display="block"
                    color="#64748b"
                    lineHeight={1}
                    fontSize="0.7rem"
                  >
                    By
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    fontSize="0.875rem"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100px",
                    }}
                  >
                    {assignerName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
