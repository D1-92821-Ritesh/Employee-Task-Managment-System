import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { FiClipboard, FiUsers,} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import Profile from './../Profile/Profile';

export default function Sidebar({ role = null, selected = null, onMenuSelect = null }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} />, path: "/dashboard", allowedRoles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { key: "tasks", label: "Tasks", icon: <FiClipboard size={22} />, path: "/tasks", allowedRoles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { key: "employees", label: "Employees", icon: <FiUsers size={22} />, path: "/employees", allowedRoles: ["ADMIN", "MANAGER"] },

  ];

  // filter menu by role if provided
  const visibleMenu = role ? menuItems.filter((m) => m.allowedRoles.includes(role)) : menuItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 320,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
          borderRadius: '30px',
          margin: '10px',
          height: '96vh',
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          color: "white",
          background: `
            radial-gradient(ellipse at 15% 25%, rgba(139,92,246,0.25), transparent 50%),
            radial-gradient(ellipse at 85% 75%, rgba(6,182,212,0.25), transparent 50%),
            linear-gradient(135deg, #0f172a, #1e293b 50%, #0f172a)
          `,
          borderRight: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 25px rgba(0,0,0,0.4)",
        },
      }}
    >
      {/* TOP SECTION */}
      <Box>
        <Typography variant="h4" fontWeight="bold">
          TaskFlow
        </Typography>
        <Typography sx={{ marginTop: "5px", fontSize: "14px", color: "#b8b8b8" }}>
          Developer Edition
        </Typography>

          {/* MENU LIST */}
        <List sx={{ marginTop: 2 }}>
          {visibleMenu.map((item) => {
            const isActive = selected ? selected === item.key : location.pathname === item.path;
            return (
              <ListItemButton
                key={item.key}
                onClick={() => {
                  // prefer in-page handler; fall back to navigation
                  if (onMenuSelect) onMenuSelect(item.key);
                  else navigate(item.path);
                }}
                sx={{
                  borderRadius: "12px",
                  marginBottom: "8px",
                  color: isActive ? "#fff" : "#cfd8e3",
                  background: isActive ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  backdropFilter: isActive ? "blur(6px)" : "none",
                  boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.25)" : "none",
                  "&:hover": {
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: "35px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Profile></Profile>
      {/* BOTTOM SECTION */}
        
      
    </Drawer>
  );
}
