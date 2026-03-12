import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "http://localhost:5091",
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5091`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("portal_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;