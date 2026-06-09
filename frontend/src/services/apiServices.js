import { api } from "../api/api";

export const testApi = () => api.get("/");

export const login = (credentials) => api.post("/login", credentials);

export const logout = () => api.post("/logout");


export const getUsers = () => api.get("/users");

export const createUser = (data) => api.post("/users", data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const getUserById = (id) => api.get(`/users/${id}`);


export const getAssets = () => api.get("/assets");

export const getAssetHistory = (id, quantity = 5) =>  api.get(`/assets/${id}/history/${quantity}`);


