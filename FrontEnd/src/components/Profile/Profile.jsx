import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material"; // Make sure these are imported
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // Get user from localStorage and parse it
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    // You can also redirect to login page here
    navigate("/")
    console.log("Logged out");
  };

  if (!user) return <p>No user found</p>; // Optional fallback

  return (
    <Box sx={{ marginTop: "auto", marginBottom: "20px" }}>
      {/* Profile */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
        }}
      >
        <Avatar
          sx={{
            width: 42,
            height: 42,
            background: "rgba(255,255,255,0.25)",
            fontWeight: 700,
            color: "black",
          }}
        >
          {user.username.charAt(0)}
        </Avatar>

        <Box>
          <Typography fontWeight="bold">{user.username}</Typography>
          <Typography fontSize="12px" color="#cccccc">
            {user.role}
          </Typography>
        </Box>
      </Box>

      {/* Logout Button */}
      <Button
        startIcon={<FiLogOut size={20} />}
        onClick={handleLogout}
        sx={{
          marginTop: "12px",
          width: "100%",
          padding: "10px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "12px",
          color: "#ffb4b4",
          fontWeight: 500,
          "&:hover": {
            background: "rgba(255,0,0,0.2)",
            color: "#ffcaca",
          },
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default Profile;
