import { createContext, useState, useEffect } from "react";
import { getUserById } from "../services/apiServices";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const userId = localStorage.getItem("userId");
          const res = await getUserById(userId); 
          setUser({ token, ...res.data }); 
        } catch (error) {
          console.error("Token inválido:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUser(null);
        }
      }
      setLoading(false);
    };

    verificarToken();
  }, []);

  const loginContext = async (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    try {
      const res = await getUserById(userId);
      setUser({ token, ...res.data });
    } catch (error) {
      console.error(error);
    }
  };

  const logoutContext = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  const updateUserContext = (nuevosDatos) => {
  setUser((prevUser) => {
    if (!prevUser) return null;
    return {
      ...prevUser,
      ...nuevosDatos 
    };
  });
};

  return (
    <AuthContext.Provider value={{ user, login: loginContext, logout: logoutContext, updateUser: updateUserContext }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}