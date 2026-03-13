import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import {
  createExternalUser,
  getExternalUsers,
  updateExternalUser,
  updateExternalUserBilling,
} from "../../services/externalUsersService";

const profileOptions = [
  { value: 1, label: "Administrador" },
  { value: 3, label: "Desarrollador" },
  { value: 4, label: "Cliente" },
];

const createBaseUser = () => ({
  usuario: "",
  password: "",
  email: "",
  full_name: "",
  identificacion: "",
  profile_id: 1,
  active: true,
});

const createBillingData = () => ({
  ruc: "",
  razon_social: "",
  nombre_comercial: "",
  direccion: "",
  telefono: "",
  obligado_contabilidad: "SI",
  nombre_firma: "",
  password_sign: "",
  ruta_logo: "",
});

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [newUser, setNewUser] = useState(createBaseUser());
  const [editingUser, setEditingUser] = useState(null);

  const [createBilling, setCreateBilling] = useState(createBillingData());
  const [editBilling, setEditBilling] = useState(createBillingData());

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getExternalUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar la lista de usuarios del API externo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) =>
      [
        user.id,
        user.usuario,
        user.email,
        user.full_name,
        user.identificacion,
        user.profile,
        user.profile_id,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, users]);

  const openCreateDialog = () => {
    setNewUser(createBaseUser());
    setCreateBilling(createBillingData());
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => setCreateDialogOpen(false);

  const openEditDialog = (user) => {
    setEditingUser({
      id: user.id,
      usuario: user.usuario || "",
      password: "",
      email: user.email || "",
      full_name: user.full_name || "",
      identificacion: user.identificacion || "",
      profile_id: Number(user.profile_id) || 1,
      active: user.active ?? true,
    });

    setEditBilling({
      ruc: user.ruc || "",
      razon_social: user.razon_social || "",
      nombre_comercial: user.nombre_comercial || "",
      direccion: user.direccion || "",
      telefono: user.telefono || "",
      obligado_contabilidad: user.obligado_contabilidad || "SI",
      nombre_firma: user.nombre_firma || "",
      password_sign: "",
      ruta_logo: user.ruta_logo || "",
    });

    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleCreateFieldChange = (name, value) => {
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFieldChange = (name, value) => {
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const isClientProfile = (profileId) => Number(profileId) === 4;

  const validateBaseUser = (user) =>
    user.usuario.trim() &&
    user.password.trim() &&
    user.email.trim() &&
    user.full_name.trim() &&
    user.identificacion.trim();

  const validateBilling = (billing) =>
    billing.ruc.trim() &&
    billing.razon_social.trim() &&
    billing.nombre_comercial.trim() &&
    billing.direccion.trim() &&
    billing.telefono.trim() &&
    billing.password_sign.trim() &&
    billing.ruta_logo.trim();

  const handleCreateUser = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateBaseUser(newUser)) {
      setErrorMessage("Completa todos los datos generales del usuario.");
      return;
    }

    if (isClientProfile(newUser.profile_id) && !validateBilling(createBilling)) {
      setErrorMessage("Para perfil Cliente completa también todos los datos de facturación.");
      return;
    }

    try {
      const created = await createExternalUser({
        usuario: newUser.usuario,
        password: newUser.password,
        email: newUser.email,
        full_name: newUser.full_name,
        identificacion: newUser.identificacion,
        profile_id: Number(newUser.profile_id),
      });

      const createdId = created?.id;

      if (isClientProfile(newUser.profile_id) && createdId) {
        await updateExternalUserBilling(createdId, createBilling);
      }

      setSuccessMessage("Usuario creado correctamente.");
      closeCreateDialog();
      await loadUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "No se pudo crear el usuario externo.");
    }
  };

  const handleUpdateUser = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!editingUser) return;

    if (!validateBaseUser(editingUser)) {
      setErrorMessage("Completa todos los datos generales para actualizar el usuario.");
      return;
    }

    if (isClientProfile(editingUser.profile_id) && !validateBilling(editBilling)) {
      setErrorMessage("Para perfil Cliente completa también los datos de facturación.");
      return;
    }

    try {
      await updateExternalUser(editingUser.id, {
        usuario: editingUser.usuario,
        password: editingUser.password,
        email: editingUser.email,
        full_name: editingUser.full_name,
        identificacion: editingUser.identificacion,
        profile_id: Number(editingUser.profile_id),
        active: !!editingUser.active,
      });

      if (isClientProfile(editingUser.profile_id)) {
        await updateExternalUserBilling(editingUser.id, editBilling);
      }

      setSuccessMessage("Usuario actualizado correctamente.");
      closeEditDialog();
      await loadUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "No se pudo actualizar el usuario externo.");
    }
  };

  const renderGeneralFields = (model, onChange) => (
    <>
      <TextField label="Usuario" value={model.usuario} onChange={(e) => onChange("usuario", e.target.value)} />
      <TextField
        label="Contraseña"
        type="password"
        value={model.password}
        onChange={(e) => onChange("password", e.target.value)}
      />
      <TextField label="Correo" value={model.email} onChange={(e) => onChange("email", e.target.value)} />
      <TextField
        label="Nombre completo"
        value={model.full_name}
        onChange={(e) => onChange("full_name", e.target.value)}
      />
      <TextField
        label="Identificación"
        value={model.identificacion}
        onChange={(e) => onChange("identificacion", e.target.value)}
      />
      <TextField
        select
        label="Perfil"
        value={model.profile_id}
        onChange={(e) => onChange("profile_id", Number(e.target.value))}
      >
        {profileOptions.map((profile) => (
          <MenuItem key={profile.value} value={profile.value}>
            {profile.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );

  const renderBillingFields = (billing, onChange) => (
    <>
      <Typography variant="subtitle2" fontWeight="bold">
        Datos de facturación (Cliente)
      </Typography>
      <TextField label="RUC" value={billing.ruc} onChange={(e) => onChange("ruc", e.target.value)} />
      <TextField
        label="Razón social"
        value={billing.razon_social}
        onChange={(e) => onChange("razon_social", e.target.value)}
      />
      <TextField
        label="Nombre comercial"
        value={billing.nombre_comercial}
        onChange={(e) => onChange("nombre_comercial", e.target.value)}
      />
      <TextField
        label="Dirección"
        value={billing.direccion}
        onChange={(e) => onChange("direccion", e.target.value)}
      />
      <TextField
        label="Teléfono"
        value={billing.telefono}
        onChange={(e) => onChange("telefono", e.target.value)}
      />
      <TextField
        select
        label="Obligado a contabilidad"
        value={billing.obligado_contabilidad}
        onChange={(e) => onChange("obligado_contabilidad", e.target.value)}
      >
        <MenuItem value="SI">SI</MenuItem>
        <MenuItem value="NO">NO</MenuItem>
      </TextField>
      <TextField
        label="Nombre firma"
        value={billing.nombre_firma}
        onChange={(e) => onChange("nombre_firma", e.target.value)}
      />
      <TextField
        label="Password firma"
        type="password"
        value={billing.password_sign}
        onChange={(e) => onChange("password_sign", e.target.value)}
      />
      <TextField
        label="Ruta logo"
        value={billing.ruta_logo}
        onChange={(e) => onChange("ruta_logo", e.target.value)}
      />
    </>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Usuarios API Facturación
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Lista, crea y edita usuarios del API externo de facturación.
      </Typography>

      <Card elevation={2}>
        <CardContent>
          <Stack spacing={2}>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
              <TextField
                fullWidth
                label="Buscar en cualquier columna"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
                Añadir usuario
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Nombre completo</TableCell>
                    <TableCell>Identificación</TableCell>
                    <TableCell>Perfil</TableCell>
                    <TableCell>Activo</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.usuario}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.identificacion}</TableCell>
                      <TableCell>{user.profile || user.profile_id}</TableCell>
                      <TableCell>{user.active ? "Sí" : "No"}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar usuario">
                          <IconButton color="primary" onClick={() => openEditDialog(user)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {loading ? "Cargando usuarios..." : "No se encontraron usuarios."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={createDialogOpen} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle>Añadir usuario API facturación</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {renderGeneralFields(newUser, handleCreateFieldChange)}
            {isClientProfile(newUser.profile_id) &&
              renderBillingFields(createBilling, (name, value) =>
                setCreateBilling((prev) => ({ ...prev, [name]: value }))
              )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateUser}>
            Crear usuario
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar usuario API facturación</DialogTitle>
        <DialogContent>
          {editingUser && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {renderGeneralFields(editingUser, handleEditFieldChange)}
              <Box>
                <Checkbox
                  checked={editingUser.active}
                  onChange={(e) => handleEditFieldChange("active", e.target.checked)}
                />
                Usuario activo
              </Box>
              {isClientProfile(editingUser.profile_id) &&
                renderBillingFields(editBilling, (name, value) =>
                  setEditBilling((prev) => ({ ...prev, [name]: value }))
                )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateUser}>
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}