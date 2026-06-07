import { api } from "../api/api";

export const testApi = () => api.get("/");

export const login = (credentials) => api.post("/login", credentials);

export const logout = () => api.post("/logout");

export const getUsers = () => api.get("/users");

export const createUser = (data) => api.post("/users", data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getUserById = (id) => api.get(`/users/${id}`);

export const getAssets = () => api.get("/assets");

export const getAssetById = (id) => api.get(`/assets/${id}`);

export const getTransactions = (type = "", assetId = "") => {
  const params = {};

  if (type !== "") {
    params.type = type;
  }

  if (assetId !== "") {
    params.asset_id = assetId;
  }

  return api.get("/transactions", { params });
};
