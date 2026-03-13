import { AppBar, Toolbar, Typography, Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../auth/AuthContext";

export default function Topbar({ onToggleSidebar }) {
  const { user, signOut } = useAuth();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "#fff", color: "#111827", borderBottom: "1px solid #e5e7eb" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 1, minHeight: { xs: 56, sm: 64 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            edge="start"
            aria-label="abrir menú"
            onClick={onToggleSidebar}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            Portal de gestión
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.fullName} - {user?.role}
          </Typography>
          <Button variant="outlined" onClick={signOut}>
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}