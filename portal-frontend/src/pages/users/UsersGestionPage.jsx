import { useEffect, useMemo, useState } from "react";
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
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  createPortalUser,
  deletePortalUser,
  deletePortalUsersBulk,
  getPortalClientUsers,
  updatePortalUser,
} from "../../services/portalUsersService";

const roleOptions = ["Admin", "Cliente", "Desarrollador"];

export default function UsersGestionPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    externalApiUsername: "",
    externalApiPassword: "",
    email: "",
    fullName: "",
    roleName: roleOptions[0],
    isActive: true,
  });

  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getPortalClientUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar la lista de clientes del portal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) =>
      [
        user.id,
        user.username,
        user.externalApiUsername,
        user.email,
        user.fullName,
        user.roleName,
        user.isActive ? "activo" : "inactivo",
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [users, search]);

  const allCurrentSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selected.includes(user.id));

  const toggleSelectAllVisible = () => {
    if (allCurrentSelected) {
      setSelected((prev) => prev.filter((id) => !filteredUsers.some((u) => u.id === id)));
      return;
    }

    setSelected((prev) => [...new Set([...prev, ...filteredUsers.map((u) => u.id)])]);
  };

  const toggleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openEditDialog = (user) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      password: "",
      externalApiUsername: user.externalApiUsername || "",
      externalApiPassword: "",
      email: user.email,
      fullName: user.fullName,
      roleName: user.roleName,
      isActive: !!user.isActive,
    });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  const openCreateDialog = () => {
    setNewUser({
      username: "",
      password: "",
      externalApiUsername: "",
      externalApiPassword: "",
      email: "",
      fullName: "",
      roleName: roleOptions[0],
      isActive: true,
    });
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateFieldChange = (name, value) => {
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFieldChange = (name, value) => {
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    if (!editingUser.password.trim()) {
      setErrorMessage("Para editar un usuario debes ingresar una nueva contraseña.");
      return;
    }

    try {
      await updatePortalUser(editingUser.id, {
        username: editingUser.username,
        password: editingUser.password,
        externalApiUsername: editingUser.externalApiUsername,
        externalApiPassword: editingUser.externalApiPassword,
        email: editingUser.email,
        fullName: editingUser.fullName,
        roleName: editingUser.roleName,
        isActive: editingUser.isActive,
      });

      setSuccessMessage("Usuario actualizado correctamente.");
      closeEditDialog();
      await loadUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "No se pudo actualizar el usuario.");
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim() || !newUser.email.trim() || !newUser.fullName.trim()) {
      setErrorMessage("Completa usuario, contraseña, correo y nombre completo para crear el usuario.");
      return;
    }

    try {
      await createPortalUser({
        username: newUser.username,
        password: newUser.password,
        externalApiUsername: newUser.externalApiUsername,
        externalApiPassword: newUser.externalApiPassword,
        email: newUser.email,
        fullName: newUser.fullName,
        roleName: newUser.roleName,
        isActive: newUser.isActive,
      });

      setSuccessMessage("Usuario creado correctamente.");
      closeCreateDialog();
      await loadUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "No se pudo crear el usuario.");
    }
  };

  const handleDeleteSingle = async (id) => {
    try {
      await deletePortalUser(id);
      setSuccessMessage("Usuario eliminado correctamente.");
      setSelected((prev) => prev.filter((x) => x !== id));
      await loadUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "No se pudo eliminar el usuario.");
    }
  };

  const handleDeleteBulk = async () => {
    if (selected.length === 0) return;

    try {
      const result = await deletePortalUsersBulk(selected);
      setSuccessMessage(`Se eliminaron ${result.deletedCount || 0} usuarios.`);
      setSelected([]);
      await loadUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo ejecutar la eliminación masiva.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestión de usuarios del portal
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Consulta, filtra, edita y elimina usuarios registrados en el portal de servicios.
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

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button variant="contained" startIcon={<Add />} onClick={openCreateDialog}>
                  Añadir usuario
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleDeleteBulk}
                  disabled={selected.length === 0}
                >
                  Eliminar seleccionados
                </Button>
              </Stack>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allCurrentSelected}
                        indeterminate={!allCurrentSelected && selected.length > 0}
                        onChange={toggleSelectAllVisible}
                      />
                    </TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Usuario API externa</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Nombre completo</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(user.id)}
                          onChange={() => toggleSelectRow(user.id)}
                        />
                      </TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.externalApiUsername || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.roleName}</TableCell>
                      <TableCell>{user.isActive ? "Activo" : "Inactivo"}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar usuario">
                          <IconButton color="primary" onClick={() => openEditDialog(user)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                          <IconButton color="error" onClick={() => handleDeleteSingle(user.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
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
        <DialogTitle>Añadir usuario del portal</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Usuario"
              value={newUser.username}
              onChange={(e) => handleCreateFieldChange("username", e.target.value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={newUser.password}
              onChange={(e) => handleCreateFieldChange("password", e.target.value)}
            />
            <TextField
              label="Usuario API externa"
              value={newUser.externalApiUsername}
              onChange={(e) => handleCreateFieldChange("externalApiUsername", e.target.value)}
            />
            <TextField
              label="Contraseña API externa"
              type="password"
              value={newUser.externalApiPassword}
              onChange={(e) => handleCreateFieldChange("externalApiPassword", e.target.value)}
            />
            <TextField
              label="Correo"
              value={newUser.email}
              onChange={(e) => handleCreateFieldChange("email", e.target.value)}
            />
            <TextField
              label="Nombre completo"
              value={newUser.fullName}
              onChange={(e) => handleCreateFieldChange("fullName", e.target.value)}
            />
            <TextField
              select
              label="Rol"
              value={newUser.roleName}
              onChange={(e) => handleCreateFieldChange("roleName", e.target.value)}
            >
              {roleOptions.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Checkbox
                checked={newUser.isActive}
                onChange={(e) => handleCreateFieldChange("isActive", e.target.checked)}
              />
              Usuario activo
            </Box>
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
        <DialogTitle>Editar usuario</DialogTitle>
        <DialogContent>
          {editingUser && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Usuario"
                value={editingUser.username}
                onChange={(e) => handleEditFieldChange("username", e.target.value)}
              />
              <TextField
                label="Nueva contraseña"
                type="password"
                value={editingUser.password}
                onChange={(e) => handleEditFieldChange("password", e.target.value)}
                helperText="Requerida para actualizar el usuario"
              />
              <TextField
                label="Usuario API externa"
                value={editingUser.externalApiUsername}
                onChange={(e) => handleEditFieldChange("externalApiUsername", e.target.value)}
              />
              <TextField
                label="Contraseña API externa"
                type="password"
                value={editingUser.externalApiPassword}
                onChange={(e) => handleEditFieldChange("externalApiPassword", e.target.value)}
              />
              <TextField
                label="Correo"
                value={editingUser.email}
                onChange={(e) => handleEditFieldChange("email", e.target.value)}
              />
              <TextField
                label="Nombre completo"
                value={editingUser.fullName}
                onChange={(e) => handleEditFieldChange("fullName", e.target.value)}
              />
              <TextField
                select
                label="Rol"
                value={editingUser.roleName}
                onChange={(e) => handleEditFieldChange("roleName", e.target.value)}
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
              <Box>
                <Checkbox
                  checked={editingUser.isActive}
                  onChange={(e) => handleEditFieldChange("isActive", e.target.checked)}
                />
                Usuario activo
              </Box>
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
