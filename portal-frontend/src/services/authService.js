import axiosClient from "../api/axiosClient";

export async function login(data) {
  const response = await axiosClient.post("/api/auth/login", data);
  return response.data;
}

export async function getCurrentUser() {
  const response = await axiosClient.get("/api/auth/me");
  return response.data;
}

export async function updateCurrentUser(data) {
  const response = await axiosClient.put("/api/auth/me", data);
  return response.data;
}

export async function changePassword(data) {
  const response = await axiosClient.put("/api/auth/me/change-password", data);
  return response.data;
}
