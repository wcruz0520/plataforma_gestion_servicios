import { useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Divider, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Stack, TextField, Typography, } from "@mui/material";

const profileOptions = [
  { value: 1, label: "Administrador" },
  { value: 3, label: "Desarrollador" },
  { value: 4, label: "Cliente" },
];

export default function UsersPage() {
  const [form, setForm] = useState({
    password: "",
    usuario: "",
    email: "",
    full_name: "",
    profile_id: profileOptions[0].value,
    identificacion: "",

    // Solo cliente
    ruc: "",
    password_sign: "",
    razon_social: "",
    firma: null,
    nombre_comercial: "",
    direccion: "",
    telefono: "",
    ruta_logo: null,
    obligado_contabilidad: "SI",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");

  const isClientProfile = Number(form.profile_id) === 4;

//   const profileOptions = useMemo(
//     () => [
//       { value: 1, label: "Administrador" },
//       { value: 3, label: "Desarrollador" },
//       { value: 4, label: "Cliente" },
//     ],
//     []
//   );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : null,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.password.trim()) newErrors.password = "*Requerido";//"La contraseña es obligatoria.";
    if (!form.usuario.trim()) newErrors.usuario = "*Requerido";//"El usuario es obligatorio.";
    if (!form.email.trim()) newErrors.email = "*Requerido";//"El correo es obligatorio.";
    if (!form.full_name.trim()) newErrors.full_name = "*Requerido";//"El nombre completo es obligatorio.";
    if (!form.profile_id) newErrors.profile_id = "*Requerido";//"Debe seleccionar un perfil.";
    if (!form.identificacion.trim()) newErrors.identificacion = "*Requerido";//"La identificación es obligatoria.";

    if (isClientProfile) {
      if (!form.ruc.trim()) newErrors.ruc = "*Requerido";//"El RUC es obligatorio.";
      if (!form.password_sign.trim()) newErrors.password_sign = "*Requerido";//"La contraseña de firma es obligatoria.";
      if (!form.razon_social.trim()) newErrors.razon_social = "*Requerido";//"La razón social es obligatoria.";
      if (!form.nombre_comercial.trim()) newErrors.nombre_comercial = "*Requerido";//"El nombre comercial es obligatorio.";
      if (!form.direccion.trim()) newErrors.direccion = "*Requerido";//"La dirección es obligatoria.";
      if (!form.telefono.trim()) newErrors.telefono = "*Requerido";//"El teléfono es obligatorio.";
      if (!form.firma) newErrors.firma = "*Requerido";//"Debe seleccionar el archivo de firma .p12.";
      if (!form.ruta_logo) newErrors.ruta_logo = "*Requerido";//"Debe seleccionar el logo.";
      if (!form.obligado_contabilidad.trim()) {
        newErrors.obligado_contabilidad = "*Requerido";//"Debe seleccionar un valor.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    if (isClientProfile) {
      const formData = new FormData();

      formData.append("password", form.password);
      formData.append("usuario", form.usuario);
      formData.append("email", form.email);
      formData.append("full_name", form.full_name);
      formData.append("profile_id", String(form.profile_id));
      formData.append("identificacion", form.identificacion);

      formData.append("ruc", form.ruc);
      formData.append("password_sign", form.password_sign);
      formData.append("razon_social", form.razon_social);
      formData.append("firma", form.firma);
      formData.append("nombre_comercial", form.nombre_comercial);
      formData.append("direccion", form.direccion);
      formData.append("telefono", form.telefono);
      formData.append("ruta_logo", form.ruta_logo);
      formData.append("obligado_contabilidad", form.obligado_contabilidad);

      return {
        data: formData,
        isMultipart: true,
      };
    }

    return {
      data: {
        password: form.password,
        usuario: form.usuario,
        email: form.email,
        full_name: form.full_name,
        profile_id: Number(form.profile_id),
        identificacion: form.identificacion,
      },
      isMultipart: false,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setGeneralError("");

    if (!validate()) return;

    try {
      const payload = buildPayload();

      console.log("Payload listo para enviar:", payload);

      // Aquí luego conectas tu servicio real.
      // Ejemplo:
      // if (payload.isMultipart) {
      //   await createClientUser(payload.data);
      // } else {
      //   await createExternalUser(payload.data);
      // }

      setSuccessMessage("Formulario validado correctamente. Listo para enviar al backend.");
    } catch (error) {
      console.error(error);
      setGeneralError("Ocurrió un error al procesar la información.");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gestión de usuarios
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Registra usuarios para el consumo del API FE.
      </Typography>

      <Card elevation={2}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
              {generalError && <Alert severity="error">{generalError}</Alert>}

              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Datos generales
                </Typography>
                <Divider />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Usuario"
                    name="usuario"
                    value={form.usuario}
                    onChange={handleChange}
                    error={!!errors.usuario}
                    helperText={errors.usuario}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Perfil"
                    name="profile_id"
                    value={form.profile_id}
                    onChange={handleChange}
                    error={!!errors.profile_id}
                    helperText={errors.profile_id}
                  >
                    {profileOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Identificación"
                    name="identificacion"
                    value={form.identificacion}
                    onChange={handleChange}
                    error={!!errors.identificacion}
                    helperText={errors.identificacion}
                  />
                </Grid>
              </Grid>

              {isClientProfile && (
                <>
                  <Box sx={{ pt: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Datos adicionales del cliente
                    </Typography>
                    <Divider />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="RUC"
                        name="ruc"
                        value={form.ruc}
                        onChange={handleChange}
                        error={!!errors.ruc}
                        helperText={errors.ruc}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Contraseña de firma"
                        name="password_sign"
                        type="password"
                        value={form.password_sign}
                        onChange={handleChange}
                        error={!!errors.password_sign}
                        helperText={errors.password_sign}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Razón social"
                        name="razon_social"
                        value={form.razon_social}
                        onChange={handleChange}
                        error={!!errors.razon_social}
                        helperText={errors.razon_social}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nombre comercial"
                        name="nombre_comercial"
                        value={form.nombre_comercial}
                        onChange={handleChange}
                        error={!!errors.nombre_comercial}
                        helperText={errors.nombre_comercial}
                      />
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <TextField
                        fullWidth
                        label="Dirección"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        error={!!errors.telefono}
                        helperText={errors.telefono}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        component="label"
                        sx={{ height: 56, justifyContent: "flex-start" }}
                      >
                        {form.firma ? `Firma: ${form.firma.name}` : "Seleccionar firma (.p12)"}
                        <input
                          hidden
                          type="file"
                          name="firma"
                          accept=".p12,application/x-pkcs12"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {errors.firma && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          {errors.firma}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        component="label"
                        sx={{ height: 56, justifyContent: "flex-start" }}
                      >
                        {form.ruta_logo ? `Logo: ${form.ruta_logo.name}` : "Seleccionar logo"}
                        <input
                          hidden
                          type="file"
                          name="ruta_logo"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {errors.ruta_logo && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          {errors.ruta_logo}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl error={!!errors.obligado_contabilidad}>
                        <FormLabel>Obligado a llevar contabilidad</FormLabel>
                        <RadioGroup
                          row
                          name="obligado_contabilidad"
                          value={form.obligado_contabilidad}
                          onChange={handleChange}
                        >
                          <FormControlLabel value="SI" control={<Radio />} label="Sí" />
                          <FormControlLabel value="NO" control={<Radio />} label="No" />
                        </RadioGroup>
                        {errors.obligado_contabilidad && (
                          <Typography variant="caption" color="error">
                            {errors.obligado_contabilidad}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setForm({
                      password: "",
                      usuario: "",
                      email: "",
                      full_name: "",
                      profile_id: profileOptions[0].value,
                      identificacion: "",
                      ruc: "",
                      password_sign: "",
                      razon_social: "",
                      firma: null,
                      nombre_comercial: "",
                      direccion: "",
                      telefono: "",
                      ruta_logo: null,
                      obligado_contabilidad: "SI",
                    });
                    setErrors({});
                    setSuccessMessage("");
                    setGeneralError("");
                  }}
                >
                  Limpiar
                </Button>

                <Button type="submit" variant="contained">
                  Guardar usuario
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}