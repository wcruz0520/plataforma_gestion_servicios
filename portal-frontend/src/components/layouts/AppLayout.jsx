import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100dvh", bgcolor: "#f7f9fc", overflow: "hidden" }}>
      <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={handleCloseSidebar} />
      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar onToggleSidebar={handleToggleSidebar} />
        <Box sx={{ p: { xs: 2, md: 3 }, overflow: "auto", flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}