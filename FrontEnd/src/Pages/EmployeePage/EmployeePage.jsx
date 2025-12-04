import { useState } from "react";
import { Box } from "@mui/material";
import Body from "../../components/Body/Body";
import Sidebar from "../../components/SideBar/SideBar";
import TaskList from "../../components/Tasks/TaskList";

export default function EmployeePage() {
  const [selected, setSelected] = useState("dashboard");

  const [userRole] = useState(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    return user?.role ?? null;
  });

  function renderContent() {
    switch (selected) {
      case "tasks":
        return <TaskList />;
      default:
        return (
          <>
            <h1>Employee Dashboard</h1>
            <p>Welcome to the Employee Page!</p>
            <p>Choose an item from the left to view details without navigating away.</p>
          </>
        );
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",        // ⭐ Required for stable dashboard layout
        padding: "16px",
        backgroundColor: "#111827",
        gap: "16px",
        overflow: "hidden",     // ⭐ Page doesn't scroll
      }}
    >
      <Sidebar 
        role={userRole}
        selected={selected}
        onMenuSelect={setSelected}
      />

      <Body>
        {renderContent()}
      </Body>
    </Box>
  );
}
