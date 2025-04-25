import { useEffect, useState } from "react";
import {
  register,
  login,
  logout,
  recoverPassword,
  checkAuth,
} from "../services/authServices.js";

import { AuthContext } from "./authContextInstance";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registro de usuario
  const registerUser = async (data) => {
    setError(null); // Limpiar error anterior
    try {
      await register(data);
    } catch (err) {
      console.log(err);
      const msg = err.response.data.message || err.response.data.error;
      setError(msg);
    }
  };

  // Dentro de loginUser
  const loginUser = async (data) => {
    setError(null); // Limpiar error anterior
    try {
      const res = await login(data);
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
      });
    } catch (err) {
      const msg = err.response.data.message || err.response.data.error;
      setError(msg);
    }
  };

  // Cierre de sesión de usuario
  const logoutUser = async () => {
    setError(null); // Limpiar error anterior
    try {
      await logout();
      setUser(null);
    } catch (err) {
      const msg = err.response.data.message || err.response.data.error;
      setError(msg);
    }
  };

  // Recuperación de contraseña
  const recoverPasswordUser = async (email) => {
    try {
      await recoverPassword(email);
    } catch (err) {
      const msg = err.response.data.message || err.response.data.error;
      setError(msg);
    }
  };

  // Persistencia de sesión con Firebase (solo para saber si está logueado)
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const res = await checkAuth();
        if (res) {
          setUser(res);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error al verificar autenticación:", err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        recoverPasswordUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
