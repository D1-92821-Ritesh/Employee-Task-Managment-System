import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Drawer, Box, Typography, Avatar, Button, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { FiClipboard, FiUsers, FiLogOut } from "react-icons/fi";
import Profile from './../Profile/Profile';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    { label: "Tasks", icon: <FiClipboard size={22} />, path: "/tasks" },
    { label: "Employees", icon: <FiUsers size={22} />, path: "/employees" },
  ];

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
          margin: '15px',
          height: '96vh',
          padding: "25px",
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
        <List sx={{ marginTop: 3 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "12px",
                marginBottom: "8px",
                color: location.pathname === item.path ? "#fff" : "#cfd8e3",
                background: location.pathname === item.path ? "rgba(255, 255, 255, 0.15)" : "transparent",
                backdropFilter: location.pathname === item.path ? "blur(6px)" : "none",
                boxShadow: location.pathname === item.path ? "0 2px 8px rgba(0,0,0,0.25)" : "none",
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
          ))}
        </List>
      </Box>
      <Profile></Profile>
      {/* BOTTOM SECTION */}
        
      
    </Drawer>
  );
}
