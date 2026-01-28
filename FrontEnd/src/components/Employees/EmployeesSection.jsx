import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import api, { transformUser } from "../../services/api";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const GLASS_STYLE = {
  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: "24px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
  border: "1px solid rgba(148,163,184,0.25)",
  color: "white",
};

// Department enum values from backend
const DEPARTMENTS = ['SALES', 'DEVELOPMENT', 'TESTING', 'DEVOPS'];

const ROLE_PRIORITY = { ADMIN: 1, MANAGER: 2, EMPLOYEE: 3 };

// ---------- FORM DIALOG COMPONENT ----------
function EmployeeFormDialog({ open, onClose, onSave, employee, managers }) {
  const isEditMode = Boolean(employee);

  const [form, setForm] = useState({
    user_id: employee?.user_id ?? null,
    username: employee?.username ?? "",
    lastName: employee?.lastName ?? "",
    email: employee?.email ?? "",
    password: "",
    role: employee?.role ?? "EMPLOYEE",
    department: employee?.department ?? "DEVELOPMENT",
    status: employee?.status ?? "ACTIVE",
    manager_id: employee?.manager_id ?? "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      user_id: employee?.user_id ?? null,
      username: employee?.username ?? "",
      lastName: employee?.lastName ?? "",
      email: employee?.email ?? "",
      password: "",
      role: employee?.role ?? "EMPLOYEE",
      department: employee?.department ?? "DEVELOPMENT",
      status: employee?.status ?? "ACTIVE",
      manager_id: employee?.manager_id ?? "",
    });
    setErrors({});
  }, [employee, open]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    // Password only required for new employees, not edits
    if (!isEditMode && !form.password.trim()) newErrors.password = "Password is required";
    if (!form.manager_id) newErrors.manager_id = "Manager is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "24px",
          border: "1px solid rgba(148,163,184,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          color: "white",
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#f1f5f9",
          pb: 1,
        }}
      >
        {isEditMode ? "Edit Employee" : "Add Employee"}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 1,
        }}
      >
        {/* First Name */}
        <TextField
          label="First Name"
          value={form.username}
          onChange={handleChange("username")}
          fullWidth
          variant="outlined"
          error={!!errors.username}
          helperText={errors.username}
          InputLabelProps={{
            sx: { color: "#94a3b8" },
          }}
          InputProps={{
            sx: {
              color: "white",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              "& fieldset": {
                borderColor: errors.username ? "#f87171" : "rgba(148,163,184,0.25)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(148,163,184,0.45)",
              },
            },
          }}
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          value={form.lastName}
          onChange={handleChange("lastName")}
          fullWidth
          variant="outlined"
          error={!!errors.lastName}
          helperText={errors.lastName}
          InputLabelProps={{
            sx: { color: "#94a3b8" },
          }}
          InputProps={{
            sx: {
              color: "white",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              "& fieldset": {
                borderColor: errors.lastName ? "#f87171" : "rgba(148,163,184,0.25)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(148,163,184,0.45)",
              },
            },
          }}
        />

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          fullWidth
          variant="outlined"
          error={!!errors.email}
          helperText={errors.email}
          InputLabelProps={{
            sx: { color: "#94a3b8" },
          }}
          InputProps={{
            sx: {
              color: "white",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              "& fieldset": {
                borderColor: errors.email ? "#f87171" : "rgba(148,163,184,0.25)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(148,163,184,0.45)",
              },
            },
          }}
        />

        {/* Password - Only show for new employee, not edit */}
        {!isEditMode && (
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            fullWidth
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password}
            InputLabelProps={{
              sx: { color: "#94a3b8" },
            }}
            InputProps={{
              sx: {
                color: "white",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: errors.password ? "#f87171" : "rgba(148,163,184,0.25)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(148,163,184,0.45)",
                },
              },
            }}
          />
        )}

        {/* Role */}
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#94a3b8" }}>Role</InputLabel>
          <Select
            value={form.role}
            onChange={handleChange("role")}
            label="Role"
            sx={{
              color: "white",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(148,163,184,0.25)" },
              "&:hover fieldset": { borderColor: "rgba(148,163,184,0.45)" },
            }}
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="MANAGER">MANAGER</MenuItem>
            <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
          </Select>
        </FormControl>

        {/* Department - Dropdown with enum values */}
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#94a3b8" }}>Department</InputLabel>
          <Select
            value={form.department}
            onChange={handleChange("department")}
            label="Department"
            sx={{
              color: "white",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(148,163,184,0.25)" },
              "&:hover fieldset": { borderColor: "rgba(148,163,184,0.45)" },
            }}
          >
            {DEPARTMENTS.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#94a3b8" }}>Status</InputLabel>
          <Select
            value={form.status}
            onChange={handleChange("status")}
            label="Status"
            sx={{
              color: "white",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              "& fieldset": { borderColor: "rgba(148,163,184,0.25)" },
              "&:hover fieldset": { borderColor: "rgba(148,163,184,0.45)" },
            }}
          >
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </Select>
        </FormControl>

        {/* Manager - Required */}
        <FormControl fullWidth error={!!errors.manager_id}>
          <InputLabel sx={{ color: errors.manager_id ? "#f87171" : "#94a3b8" }}>Manager *</InputLabel>
          <Select
            value={form.manager_id ?? ""}
            onChange={handleChange("manager_id")}
            label="Manager *"
            sx={{
              color: "white",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              "& fieldset": { borderColor: errors.manager_id ? "#f87171" : "rgba(148,163,184,0.25)" },
              "&:hover fieldset": { borderColor: "rgba(148,163,184,0.45)" },
            }}
          >
            {managers.map((m) => (
              <MenuItem key={m.user_id} value={m.user_id}>
                {m.username} (ID: {m.user_id})
              </MenuItem>
            ))}
          </Select>
          {errors.manager_id && (
            <Typography sx={{ color: "#f87171", fontSize: "0.75rem", mt: 0.5, ml: 1.5 }}>
              {errors.manager_id}
            </Typography>
          )}
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: "#cbd5e1",
            fontWeight: 600,
            borderRadius: "12px",
            px: 2.5,
            py: 1,
            background: "rgba(255,255,255,0.05)",
            "&:hover": {
              background: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            py: 1,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 12px 32px rgba(99,102,241,0.55)",
            },
          }}
        >
          {isEditMode ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


// ---------- MAIN COMPONENT ----------
export default function EmployeesSection() {
  const [currentUser] = useState(() => {
    try {
      const str = localStorage.getItem("user");
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = currentUser?.role === "ADMIN";
  const isManager = currentUser?.role === "MANAGER";

  const [employees, setEmployees] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      let response;

      // Use the dedicated endpoint for managers to get their team members
      if (currentUser?.role === "MANAGER" && currentUser?.user_id) {
        response = await api.get(`/users/manager/${currentUser.user_id}`);
      } else {
        // Admin gets all users
        response = await api.get("/users");
      }

      // Transform backend data to frontend format
      setEmployees(response.data.map(transformUser));
    } catch (error) {
      console.error("Error fetching employees:", error);
      // toast.error("Failed to load employees."); // Optional: Don't spam toasts on load
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchEmployees();
    }
  }, [currentUser]);

  const managers = useMemo(
    () => employees.filter((e) => e.role === "MANAGER"),
    [employees]
  );

  // FILTER based on role - already filtered by API for managers
  const visibleEmployees = useMemo(() => {
    if (!currentUser) return [];

    // For managers, the API already returns their team, but filter to show only employees
    if (isManager) {
      return employees.filter((e) => e.role === "EMPLOYEE");
    }

    // Admin sees all
    if (isAdmin) return employees;

    return [];
  }, [employees, currentUser, isAdmin, isManager]);

  // SORT
  const sortedEmployees = useMemo(() => {
    return [...visibleEmployees].sort((a, b) => {
      const r1 = ROLE_PRIORITY[a.role] ?? 99;
      const r2 = ROLE_PRIORITY[b.role] ?? 99;
      if (r1 !== r2) return r1 - r2;
      return a.username.localeCompare(b.username);
    });
  }, [visibleEmployees]);

  // ---- ACTIONS ----

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/users/${id}`);
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleOpenAdd = () => {
    if (!isAdmin) return;
    setEditingEmployee(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (emp) => {
    if (!isAdmin) return;
    setEditingEmployee(emp);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveFromDialog = async (form) => {
    try {
      // Transform form data to backend format
      const backendPayload = {
        firstName: form.username || form.firstName,
        lastName: form.lastName || '',
        email: form.email || `${form.username?.toLowerCase().replace(/\s+/g, '')}@example.com`,
        password: form.password_hash || form.password || 'password123',
        role: form.role,
        status: form.status === 'ACTIVE',
        department: form.department,
        managerId: form.manager_id ? parseInt(form.manager_id) : null,
      };

      if (form.user_id) {
        // EDIT EXISTING - backend expects UserUpdateDTO (requires email)
        await api.put(`/users/${form.user_id}`, {
          firstName: backendPayload.firstName,
          lastName: backendPayload.lastName,
          email: backendPayload.email,
          role: backendPayload.role,
          status: backendPayload.status,
          department: backendPayload.department,
          managerId: backendPayload.managerId,
        });
        toast.success("Employee updated successfully");
      } else {
        // ADD NEW - backend expects UserCreateDTO
        await api.post("/users", backendPayload);
        toast.success("Employee created successfully");
      }
      fetchEmployees();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save employee");
    }
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, color: "white" }}>
        <Typography variant="h6">Please login.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        color: "white",
        p: 3,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="700">
            Employees
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
            {isAdmin
              ? "View and manage all employees in the organisation."
              : "Employees working under you."}
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            onClick={handleOpenAdd}
            startIcon={<FiPlus />}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              color: "#e6e9ff",
              background: "linear-gradient(145deg, rgba(129,140,248,0.12), rgba(99,102,241,0.08))",
              border: "1px solid rgba(129,140,248,0.22)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 6px 18px rgba(99,102,241,0.08)",
              '&:hover': {
                background: "linear-gradient(145deg, rgba(129,140,248,0.18), rgba(99,102,241,0.12))",
                transform: 'translateY(-2px)',
              }
            }}
          >
            Add Employee
          </Button>
        )}
      </Box>

      {/* EMPLOYEE TABLE WITH CARD ROWS */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: "0px",
          border: "1px solid rgba(148,163,184,0.25)",
          overflow: "hidden",
        }}
      >
        {/* TABLE HEADER */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 140px 120px 120px",
            gap: 2,
            padding: "16px 20px",
            background: "rgba(30,41,59,0.8)",
            borderBottom: "2px solid rgba(148,163,184,0.2)",
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#cbd5f5", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Employee
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#cbd5f5", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Role
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#cbd5f5", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Department
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#cbd5f5", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Status
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#cbd5f5", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "right" }}>
            Actions
          </Typography>
        </Box>

        {/* SCROLLABLE ROWS */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: "12px 12px",
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(148,163,184,0.4)",
              borderRadius: 999,
              "&:hover": { background: "rgba(148,163,184,0.6)" },
            },
          }}
        >
          {sortedEmployees.map((emp) => (
            <Box
              key={emp.user_id}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 140px 120px 120px",
                gap: 2,
                padding: "14px 20px",
                alignItems: "center",
                background: "linear-gradient(135deg, rgba(51,65,85,0.5) 0%, rgba(30,41,59,0.4) 100%)",
                border: "1.5px solid rgba(148,163,184,0.3)",
                borderRadius: "0px",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.12)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                flexShrink: 0,
                "&:hover": {
                  transform: "translateY(-4px)",
                  background: "linear-gradient(135deg, rgba(79,102,131,0.6) 0%, rgba(51,65,85,0.5) 100%)",
                  border: "1.5px solid rgba(148,163,184,0.55)",
                  boxShadow: "0 16px 40px rgba(99,102,241,0.2), inset 0 1px 1px rgba(255,255,255,0.2)",
                },
              }}
            >
              {/* Employee Name & ID */}
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ color: "#f1f5f9", fontSize: "15px" }}>
                  {emp.username}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "12px" }}>
                  ID: {emp.user_id}
                </Typography>
              </Box>

              {/* Role */}
              <Box>
                <Chip
                  label={emp.role}
                  size="small"
                  sx={{
                    bgcolor:
                      emp.role === "ADMIN"
                        ? "rgba(239,68,68,0.2)"
                        : emp.role === "MANAGER"
                          ? "rgba(59,130,246,0.2)"
                          : "rgba(34,197,94,0.2)",
                    color:
                      emp.role === "ADMIN"
                        ? "#fca5a5"
                        : emp.role === "MANAGER"
                          ? "#93c5fd"
                          : "#86efac",
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    fontSize: "12px",
                  }}
                />
              </Box>

              {/* Department */}
              <Box>
                <Typography variant="body2" sx={{ color: "#cbd5e1", fontWeight: 600, fontSize: "14px" }}>
                  {emp.department}
                </Typography>
              </Box>

              {/* Status */}
              <Box>
                <Chip
                  label={emp.status === "ACTIVE" ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    bgcolor:
                      emp.status === "ACTIVE"
                        ? "rgba(34,197,94,0.2)"
                        : "rgba(148,163,184,0.1)",
                    color: emp.status === "ACTIVE" ? "#86efac" : "#cbd5e1",
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    fontSize: "12px",
                  }}
                />
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                <IconButton
                  size="small"
                  onClick={() => handleOpenEdit(emp)}
                  sx={{
                    color: "#93c5fd",
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: "8px",
                    padding: "6px",
                    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": {
                      background: "rgba(59,130,246,0.25)",
                      transform: "scale(1.15)",
                      boxShadow: "0 8px 20px rgba(59,130,246,0.2)",
                    },
                  }}
                  disabled={!isAdmin}
                >
                  <FiEdit2 size={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(emp.user_id)}
                  sx={{
                    color: "#fca5a5",
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "8px",
                    padding: "6px",
                    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    "&:hover": {
                      background: "rgba(239,68,68,0.25)",
                      transform: "scale(1.15)",
                      boxShadow: "0 8px 20px rgba(239,68,68,0.2)",
                    },
                  }}
                  disabled={!isAdmin}
                >
                  <FiTrash2 size={16} />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ADD / EDIT DIALOG */}
      {isAdmin && (
        <EmployeeFormDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveFromDialog}
          employee={editingEmployee}
          managers={managers}
        />
      )}
    </Box>
  );
}
