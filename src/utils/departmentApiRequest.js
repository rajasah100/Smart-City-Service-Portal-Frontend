import axios from "axios";

const departmentApiRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

departmentApiRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("departmentToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default departmentApiRequest;