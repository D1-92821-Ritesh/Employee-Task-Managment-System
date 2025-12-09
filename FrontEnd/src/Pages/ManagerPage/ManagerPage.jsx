import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Body from "../../components/Body/Body";
import Sidebar from "../../components/SideBar/SideBar";
import TaskList from "../../components/Tasks/TaskList";
import Dashboard from "../../components/Dashboard/Dashboard";
import EmployeesSection from "../../components/Employees/EmployeesSection";

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
          <EmployeesSection />
        );
      
      default:
        return <Dashboard />;
    }
  }

  useEffect(() => {
    const onNavigate = (e) => {
      const sel = e?.detail?.selected;
      if (sel) setSelected(sel);
    };
    window.addEventListener("navigate", onNavigate);
    return () => window.removeEventListener("navigate", onNavigate);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",      
        padding: "16px",
        backgroundColor: "#111827",
        gap: "16px",
        overflow: "hidden",   
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
