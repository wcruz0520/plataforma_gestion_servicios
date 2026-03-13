import { Box, Collapse, Drawer, List, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { ExpandLess, ExpandMore} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const sidebarWidth = 270;

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const canManageExternalUsers = ["Admin", "Desarrollador"].includes(user?.role);
  const [openApiFe, setOpenApiFe] = useState(true);
  const [openGestion, setOpenGestion] = useState(true);

  const handleApiFeClick = () => {
    setOpenApiFe(!openApiFe);
  };

  const handleGestionClick = () => {
    setOpenGestion(!openGestion);
  };

  const handleNavigate = () => {
    if (mobileOpen) {
      onCloseMobile?.();
    }
  };

  const subItemsApiFe = [
    // { text: "Usuarios", path: "/users" },
    { text: "Requests", path: "/requests" }
  ];

  const subItemsGestion = [];

  if (canManageExternalUsers) {
    subItemsApiFe.unshift({ text: "Usuarios API", path: "/users" });
    }

  if (isAdmin) {
    subItemsGestion.push({ text: "Usuarios Portal", path: "/usersgestion" });
  }


  const content = (
    <Box
      sx={{
        width: sidebarWidth,
        bgcolor: "#111827",
        minWidth: sidebarWidth,
        maxWidth: sidebarWidth,
        flexShrink: 0,
        color: "#fff",
        minHeight: "100vh"
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Menu principal
        </Typography>
      </Toolbar>

      <List>

        {/* Dashboard */}
        <ListItemButton
          component={Link}
          to="/"
          onClick={handleNavigate}
          selected={location.pathname === "/"}
          sx={{
            color: "#fff",
            "&.Mui-selected": { bgcolor: "#1f2937" }
          }}
        >
          <ListItemText primary="Inicio" />
        </ListItemButton>

        {/* MENU PRINCIPAL */}
        <ListItemButton onClick={handleApiFeClick} sx={{ color: "#fff" }}>
          <ListItemText primary="API Facturacion" />
          {openApiFe ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        {/* SUBMENUS */}
        <Collapse in={openApiFe} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            {subItemsApiFe.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                onClick={handleNavigate}
                selected={location.pathname === item.path}
                sx={{
                  pl: 4,
                  color: "#d1d5db",
                  "&.Mui-selected": { bgcolor: "#1f2937", color: "#fff" }
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}

          </List>
        </Collapse>
        
        {isAdmin && (
          <>
            <ListItemButton onClick={handleGestionClick} sx={{ color: "#fff" }}>
              <ListItemText primary="Gestion" />
              {openGestion ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            {/* SUBMENUS */}
            <Collapse in={openGestion} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>

                {subItemsGestion.map((item) => (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={handleNavigate}
                    selected={location.pathname === item.path}
                    sx={{
                      pl: 4,
                      color: "#d1d5db",
                      "&.Mui-selected": { bgcolor: "#1f2937", color: "#fff" }
                    }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                ))}

              </List>
            </Collapse>
          </>
        )}

        {/* Cuenta */}
        <ListItemButton
          component={Link}
          to="/account"
          onClick={handleNavigate}
          selected={location.pathname === "/account"}
          sx={{
            color: "#fff",
            "&.Mui-selected": { bgcolor: "#1f2937" }
          }}
        >
          <ListItemText primary="Cuenta" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: sidebarWidth, boxSizing: "border-box" },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: sidebarWidth, boxSizing: "border-box", position: "relative" },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}