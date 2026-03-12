import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { changePassword, getCurrentUser, updateCurrentUser } from "../../services/authService";

const initialProfile = {
  username: "",
  externalApiUsername: "",
  externalApiPassword: "",
  email: "",
  fullName: "",
};

const initialPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AccountPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [passwordForm, setPasswordForm] = useState(initialPassword);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await getCurrentUser();
      setProfile({
        username: data.username ?? "",
        externalApiUsername: data.externalApiUsername ?? "",
        externalApiPassword: data.externalApiPassword ?? "",
        email: data.email ?? "",
        fullName: data.fullName ?? "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "No fue posible cargar tu información.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setMessage({ type: "", text: "" });

    try {
      const data = await updateCurrentUser(profile);
      setProfile({
        username: data.username ?? "",
        externalApiUsername: data.externalApiUsername ?? "",
        externalApiPassword: data.externalApiPassword ?? "",
        email: data.email ?? "",
        fullName: data.fullName ?? "",
      });
      setMessage({ type: "success", text: "Perfil actualizado correctamente." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "No se pudo actualizar el perfil.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "La nueva contraseña y su confirmación no coinciden." });
      return;
    }

    setSavingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(initialPassword);
      setShowPasswordForm(false);
      setMessage({ type: "success", text: "Contraseña actualizada correctamente." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "No se pudo actualizar la contraseña.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <Typography variant="h6">Cargando información de la cuenta...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Cuenta
      </Typography>

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Información actual
          </Typography>

          <Box component="form" onSubmit={handleSaveProfile}>
            <Stack spacing={2}>
              <TextField
                label="Usuario"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                required
              />
              <TextField
                label="Nombre completo"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                required
              />
              <TextField
                label="Correo"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
              <TextField
                label="Usuario API Externa"
                name="externalApiUsername"
                value={profile.externalApiUsername}
                onChange={handleProfileChange}
              />
              <TextField
                label="Clave API Externa"
                name="externalApiPassword"
                value={profile.externalApiPassword}
                onChange={handleProfileChange}
                type="password"
              />

              <Button type="submit" variant="contained" disabled={savingProfile}>
                {savingProfile ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Seguridad
          </Typography>

          <Button variant="outlined" onClick={() => setShowPasswordForm((prev) => !prev)}>
            {showPasswordForm ? "Cancelar" : "Cambiar contraseña"}
          </Button>

          <Collapse in={showPasswordForm}>
            <Box component="form" mt={2} onSubmit={handleSavePassword}>
              <Stack spacing={2}>
                <TextField
                  label="Contraseña actual"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <TextField
                  label="Nueva contraseña"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <TextField
                  label="Confirmar nueva contraseña"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <Button type="submit" variant="contained" disabled={savingPassword}>
                  {savingPassword ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </Stack>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Stack>
  );
}
