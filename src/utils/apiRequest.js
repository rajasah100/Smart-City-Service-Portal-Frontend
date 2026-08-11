import axios from "axios";

const apiRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

apiRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiRequest;