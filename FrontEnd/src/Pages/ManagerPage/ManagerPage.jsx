import { useState } from "react";
import { Box } from "@mui/material";
import Body from "../../components/Body/Body";
import Sidebar from "../../components/SideBar/SideBar";
import TaskList from "../../components/Tasks/TaskList";

export default function ManagerPage() {
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

      case "employees":
        return (
          <>
            <h2>Employees</h2>
            <p>Employee list and management UI will show here.</p>
          </>
        );

      default:
        return (
          <>
            <h1>Manager Dashboard</h1>
            <p>Welcome to the Manager Page!</p>
            <p>Choose an item from the left to view details without navigating away.</p>
          </>
        );
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",      // ⭐ Required for proper dashboard layout
        padding: "16px",
        backgroundColor: "#111827",
        gap: "16px",
        overflow: "hidden",   // ⭐ Prevents the page from scrolling
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
