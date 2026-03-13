import axiosClient from "../api/axiosClient";

export async function getExternalUsers() {
  const response = await axiosClient.get("/api/external-users");
  return response.data;
}

export async function createExternalUser(data) {
  const response = await axiosClient.post("/api/external-users", data);
  return response.data;
}

export async function updateExternalUser(id, data) {
  const response = await axiosClient.put(`/api/external-users/${id}`, data);
  return response.data;
}

export async function updateExternalUserBilling(id, data) {
  const response = await axiosClient.put(`/api/external-users/${id}/data_factura`, data);
  return response.data;
}
