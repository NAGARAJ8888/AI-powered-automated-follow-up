import axiosInstance from "./axiosInstance.js";

export const login = (data) => axiosInstance.post("/api/auth/login", data);
export const register = (data) => axiosInstance.post("/api/auth/register", data);
