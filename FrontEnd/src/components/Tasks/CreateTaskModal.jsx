import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../services/api";

const GLASS_STYLE = {
  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: "24px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "white",
};

const labelStyle = {
  fontSize: "0.9rem",
  fontWeight: "500",
  color: "rgba(255,255,255,0.8)",
  mb: 0.5,
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.15)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#818cf8",
      borderWidth: "2px",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#f87171",
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
};

export default function CreateTaskModal({ open, onClose, onTaskCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigned_to_id: "",
    due_date: "",
  });

  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          // Ideally fetch only employees: api.get('/users?role=EMPLOYEE')
          const response = await api.get("/users");
          setEmployees(response.data.filter(u => u.role === "EMPLOYEE"));
        } catch (error) {
          console.error("Failed to fetch employees", error);
        }
      };
      fetchData();
    }
  }, [open]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.assigned_to_id) newErrors.assigned_to_id = "Assign to an employee";
    if (!formData.due_date) newErrors.due_date = "Due date is required";

    if (formData.due_date && new Date(formData.due_date) < new Date()) {
      newErrors.due_date = "Due date cannot be in the past";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newTaskPayload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: "TO_DO",
        assigned_to_id: parseInt(formData.assigned_to_id),
        assigned_by_id: parseInt(currentUser.user_id),
        due_date: formData.due_date,
      };

      const response = await api.post("/tasks", newTaskPayload);
      toast.success("Task created successfully!");
      onTaskCreate(response.data);
      handleClose();
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create task");
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      assigned_to_id: "",
      due_date: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          ...GLASS_STYLE,
          p: 0,
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          fontWeight: "700",
          fontSize: "1.6rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          pb: 2,
        }}
      >
        Create New Task
      </DialogTitle>

      {/* FORM */}
      <DialogContent
        sx={{
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* TITLE */}
        <Box>
          <Typography sx={labelStyle}>Task Title</Typography>
          <TextField
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            placeholder="Enter task title"
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title}
            InputLabelProps={{ shrink: false }}
            sx={inputStyle}
          />
        </Box>

        {/* DESCRIPTION */}
        <Box>
          <Typography sx={labelStyle}>Description</Typography>
          <TextField
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Enter task description (optional)"
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            sx={inputStyle}
          />
        </Box>

        {/* PRIORITY */}
        <Box>
          <Typography sx={labelStyle}>Priority</Typography>
          <FormControl fullWidth>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              variant="outlined"
              sx={inputStyle}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* ASSIGN TO */}
        <Box>
          <Typography sx={labelStyle}>Assign To</Typography>
          <FormControl fullWidth error={!!errors.assigned_to_id}>
            <Select
              name="assigned_to_id"
              value={formData.assigned_to_id}
              onChange={handleInputChange}
              variant="outlined"
              sx={inputStyle}
            >
              {employees.map((emp) => (
                <MenuItem key={emp.user_id} value={emp.user_id}>
                  {emp.username}
                </MenuItem>
              ))}
            </Select>

            {errors.assigned_to_id && (
              <Typography
                sx={{ color: "#f87171", fontSize: "0.75rem", mt: 0.5 }}
              >
                {errors.assigned_to_id}
              </Typography>
            )}
          </FormControl>
        </Box>

        {/* DUE DATE */}
        <Box>
          <Typography sx={labelStyle}>Due Date</Typography>
          <TextField
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={!!errors.due_date}
            helperText={errors.due_date}
            sx={inputStyle}
          />
        </Box>
      </DialogContent>

      {/* BUTTONS */}
      <DialogActions
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          p: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            "&:hover": {
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            },
          }}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
