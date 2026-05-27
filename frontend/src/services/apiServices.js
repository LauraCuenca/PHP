import { api } from "../api/api";

export const testApi = () => api.get("/");

export const login = (credentials) => api.post("/login", credentials);

export const logout = () => api.post("/logout");

export const getUsers = () => api.get("/users");

export const createUser = (data) => api.post("/users", data);

export const updateUser = (data) => api.put(`/users/${data.id}`, data);

export const deleteUser = (data) => api.delete(`/users/${data.id}`);

