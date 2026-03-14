import axiosClient from "../api/axiosClient";

export async function getRequestLogs() {
  const response = await axiosClient.get("/api/external-request-logs");
  const payload = response.data;

  if (payload && typeof payload === "object" && Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}
