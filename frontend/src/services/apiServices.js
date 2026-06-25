import { api } from "../api/api";

export const testApi = () => api.get("/");

export const login = (credentials) => api.post("/login", credentials);
export const logout = () => api.post("/logout");

export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const getUserById = (id) => api.get(`/users/${id}`);

export const getAssets = (params) => api.get(`/assets?${params}`);
export const getAssetHistory = (id, quantity = 5) => api.get(`/assets/${id}/history/${quantity}`);

export const buyAsset = (assetId, quantity) => api.post('/trade/buy', { asset_id: assetId, quantity });
export const sellAsset = (assetId, quantity) => api.post('/trade/sell', { asset_id: assetId, quantity });

export const getTransactions = (type = "", assetId = "") => {
  const params = {};

<<<<<<<<< Temporary merge branch 1
export const getPortfolio = () =>  api.get('/portfolio');

export const deletePortfolioAsset = (assetId) =>  api.delete(`/portfolio/${assetId}`);
=========
  if (type !== "") {
    params.type = type;
  }

  if (assetId !== "") {
    params.asset_id = assetId;
  }

  return api.get("/transactions", { params });
};
