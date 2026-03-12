import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

export default function Topbar() {
  const { user, signOut } = useAuth();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: "#fff", color: "#111827", borderBottom: "1px solid #e5e7eb" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Portal de gestión</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">
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