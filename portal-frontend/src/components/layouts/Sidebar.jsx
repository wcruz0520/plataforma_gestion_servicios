import { Box, List, ListItemButton, ListItemText, Toolbar, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [openApiFe, setOpenApiFe] = useState(true);
  const [openGestion, setOpenGestion] = useState(true);

  const handleApiFeClick = () => {
    setOpenApiFe(!openApiFe);
  };

  const handleGestionClick = () => {
    setOpenGestion(!openGestion);
  };

  const subItemsApiFe = [
    // { text: "Usuarios", path: "/users" },
    { text: "Requests", path: "/requests" }
  ];

  const subItemsGestion = [];

  if (isAdmin) {
    subItemsApiFe.unshift({ text: "Usuarios", path: "/users" });
    subItemsGestion.push({ text: "Usuarios", path: "/usersgestion" });
  }


  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#111827",
        color: "#fff",
        minHeight: "100vh"
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Servicios
        </Typography>
      </Toolbar>

      <List>

        {/* Dashboard */}
        <ListItemButton
          component={Link}
          to="/"
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
          <ListItemText primary="Api FE SOLSAP" />
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

        {/* Cuenta */}
        <ListItemButton
          component={Link}
          to="/account"
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
}