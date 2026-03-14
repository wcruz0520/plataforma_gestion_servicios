import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { getRequestLogs } from "../../services/requestLogsService";

const methodOptions = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function formatDate(value) {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("es-EC", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

export default function RequestsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [methodFilter, setMethodFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getRequestLogs();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar el historial de requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = useMemo(() => {
    if (!isAdmin) {
      return logs;
    }

    const normalizedUserFilter = userFilter.trim().toLowerCase();
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;

    return logs.filter((log) => {
      const methodMatches = methodFilter ? (log.method || "").toUpperCase() === methodFilter : true;

      const userMatches = normalizedUserFilter
        ? (log.user_identifier || "").toLowerCase().includes(normalizedUserFilter)
        : true;

      const requestDate = log.request_at ? new Date(log.request_at) : null;
      const fromMatches = fromDate && requestDate ? requestDate >= fromDate : !fromDate;
      const toMatches = toDate && requestDate ? requestDate <= toDate : !toDate;

      return methodMatches && userMatches && fromMatches && toMatches;
    });
  }, [dateFrom, dateTo, isAdmin, logs, methodFilter, userFilter]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Historial de requests</Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {isAdmin && (
        <Card>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Filtrar por método"
                value={methodFilter}
                onChange={(event) => setMethodFilter(event.target.value)}
                fullWidth
              >
                <MenuItem value="">Todos</MenuItem>
                {methodOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Buscar por usuario"
                value={userFilter}
                onChange={(event) => setUserFilter(event.target.value)}
                placeholder="Ej. codecarv22"
                fullWidth
              />

              <TextField
                label="Desde"
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Hasta"
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Endpoint</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Usuario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay registros para mostrar.
                    </TableCell>
                  </TableRow>
                )}

                {filteredLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.endpoint || "-"}</TableCell>
                    <TableCell>{log.method || "-"}</TableCell>
                    <TableCell>{formatDate(log.request_at)}</TableCell>
                    <TableCell>{log.response_code ?? "-"}</TableCell>
                    <TableCell>{log.response_detail || "-"}</TableCell>
                    <TableCell>{log.user_identifier || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {loading && (
            <Box mt={2}>
              <Typography variant="body2">Cargando registros...</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
