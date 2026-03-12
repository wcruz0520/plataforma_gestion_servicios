import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, TextField, Typography, Box, Alert } from "@mui/material";
import { login } from "../../services/authService";
import { useAuth } from "../../auth/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(form);
      signIn(data);
      navigate("/");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f4f6f8",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Iniciar sesión
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Portal de usuarios
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              margin="normal"
              value={form.username}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Ingresar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}