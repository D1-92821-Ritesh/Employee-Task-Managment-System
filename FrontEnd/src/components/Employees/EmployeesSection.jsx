import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
import { USER } from "../../data/mockData";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const GLASS_STYLE = {
  background: "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)",
  borderRadius: "24px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
  border: "1px solid rgba(148,163,184,0.25)",
  color: "white",
};

const ROLE_PRIORITY = { ADMIN: 1, MANAGER: 2, EMPLOYEE: 3 };

// ---------- FORM DIALOG COMPONENT ----------
function EmployeeFormDialog({ open, onClose, onSave, employee, managers }) {
  const isEditMode = Boolean(employee);

  const [form, setForm] = useState({
    user_id: employee?.user_id ?? null,
    username: employee?.username ?? "",
    role: employee?.role ?? "EMPLOYEE",
    department: employee?.department ?? "General",
    status: employee?.status ?? "ACTIVE",
    manager_id: employee?.manager_id ?? "",
  });

  useEffect(() => {
    setForm({
      user_id: employee?.user_id ?? null,
      username: employee?.username ?? "",
      role: employee?.role ?? "EMPLOYEE",
      department: employee?.department ?? "General",
      status: employee?.status ?? "ACTIVE",
      manager_id: employee?.manager_id ?? "",
    });
  }, [employee, open]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!form.username.trim()) return; // basic validation
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
          backgroundColor: "#020617",
          color: "white",
          borderRadius: "20px",
          border: "1px solid rgba(148,163,184,0.4)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {isEditMode ? "Edit Employee" : "Add Employee"}
      </DialogTitle>

      <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Username"
          value={form.username}
          onChange={handleChange("username")}
          fullWidth
          variant="outlined"
          InputLabelProps={{ sx: { color: "#9ca3af" } }}
          InputProps={{ sx: { color: "white" } }}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ color: "#9ca3af" }}>Role</InputLabel>
          <Select
            value={form.role}
            label="Role"
            onChange={handleChange("role")}
            sx={{ color: "white" }}
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="MANAGER">MANAGER</MenuItem>
            <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Department"
          value={form.department}
          onChange={handleChange("department")}
          fullWidth
          variant="outlined"
          InputLabelProps={{ sx: { color: "#9ca3af" } }}
          InputProps={{ sx: { color: "white" } }}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ color: "#9ca3af" }}>Status</InputLabel>
          <Select
            value={form.status}
            label="Status"
            onChange={handleChange("status")}
            sx={{ color: "white" }}
          >
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel sx={{ color: "#9ca3af" }}>Manager</InputLabel>
          <Select
            value={form.manager_id ?? ""}
            label="Manager"
            onChange={handleChange("manager_id")}
            sx={{ color: "white" }}
          >
            <MenuItem value="">None</MenuItem>
            {managers.map((m) => (
              <MenuItem key={m.user_id} value={m.user_id}>
                {m.username} (ID: {m.user_id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ textTransform: "none", fontWeight: 600 }}
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

  const [employees, setEmployees] = useState(() =>
    USER.map((u) => ({
      ...u,
      department: u.department || "General",
      status: u.status || "ACTIVE",
    }))
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const managers = useMemo(
    () => employees.filter((e) => e.role === "MANAGER"),
    [employees]
  );

  // FILTER based on role
  const visibleEmployees = useMemo(() => {
    if (!currentUser) return [];

    if (isAdmin) return employees;

    if (isManager)
      return employees.filter(
        (e) => e.manager_id === currentUser.user_id && e.role === "EMPLOYEE"
      );

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

  const handleDelete = (id) => {
    if (!isAdmin) return;
    setEmployees((prev) => prev.filter((e) => e.user_id !== id));
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

  const handleSaveFromDialog = (form) => {
    setEmployees((prev) => {
      if (form.user_id) {
        // EDIT EXISTING
        return prev.map((e) =>
          e.user_id === form.user_id
            ? {
                ...e,
                username: form.username,
                role: form.role,
                department: form.department,
                status: form.status,
                manager_id: form.manager_id || null,
              }
            : e
        );
      } else {
        // ADD NEW
        const maxId = prev.reduce((m, e) => Math.max(m, e.user_id), 0);
        const newEmp = {
          user_id: maxId + 1,
          username: form.username,
          password_hash: "password123",
          role: form.role,
          manager_id: form.manager_id || null,
          department: form.department,
          status: form.status,
        };
        return [...prev, newEmp];
      }
    });

    setDialogOpen(false);
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
            variant="contained"
            startIcon={<FiPlus />}
            onClick={handleOpenAdd}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add Employee
          </Button>
        )}
      </Box>

      {/* TABLE */}
      <Card sx={{ ...GLASS_STYLE, flex: 1, minHeight: 0 }}>
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(148,163,184,0.6)",
                borderRadius: 999,
              },
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#cbd5f5" }}>Employee</TableCell>
                  <TableCell sx={{ color: "#cbd5f5" }}>Role</TableCell>
                  <TableCell sx={{ color: "#cbd5f5" }}>Department</TableCell>
                  <TableCell sx={{ color: "#cbd5f5" }}>Status</TableCell>
                  <TableCell align="right" sx={{ color: "#cbd5f5" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedEmployees.map((emp) => (
                  <TableRow key={emp.user_id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{emp.username}</Typography>
                      <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                        ID: {emp.user_id}
                      </Typography>
                    </TableCell>

                    <TableCell>
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
                          color: "#e5e7eb",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell>{emp.department}</TableCell>

                    <TableCell>
                      <Chip
                        label={emp.status === "ACTIVE" ? "Active" : "Inactive"}
                        size="small"
                        sx={{
                          bgcolor:
                            emp.status === "ACTIVE"
                              ? "rgba(34,197,94,0.2)"
                              : "rgba(148,163,184,0.25)",
                          color: emp.status === "ACTIVE" ? "#bbf7d0" : "#e5e7eb",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(emp)}
                          sx={{ color: "#e5e7eb" }}
                          disabled={!isAdmin}
                        >
                          <FiEdit2 size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(emp.user_id)}
                          sx={{ color: "#fca5a5" }}
                          disabled={!isAdmin}
                        >
                          <FiTrash2 size={16} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>

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
