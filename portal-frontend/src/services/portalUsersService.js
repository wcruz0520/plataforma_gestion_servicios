import axiosClient from "../api/axiosClient";

export async function createPortalUser(data) {
  const response = await axiosClient.post("/api/portal-users", data);
  return response.data;
}

export async function getPortalClientUsers() {
  const response = await axiosClient.get("/api/portal-users/clients");
  return response.data;
}

export async function updatePortalUser(id, data) {
  const response = await axiosClient.put(`/api/portal-users/${id}`, data);
  return response.data;
}

export async function deletePortalUser(id) {
  const response = await axiosClient.delete(`/api/portal-users/${id}`);
  return response.data;
}

export async function deletePortalUsersBulk(userIds) {
  const response = await axiosClient.post("/api/portal-users/delete-bulk", { userIds });
  return response.data;
}
