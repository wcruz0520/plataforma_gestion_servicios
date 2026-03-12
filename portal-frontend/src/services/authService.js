import axiosClient from "../api/axiosClient";

export async function login(data) {
  const response = await axiosClient.post("/api/auth/login", data);
  return response.data;
}