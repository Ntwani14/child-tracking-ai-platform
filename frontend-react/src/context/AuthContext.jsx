import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    if (token && email) setUser({ token, email, name, role });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userName", data.fullName);
    localStorage.setItem("userRole", data.role);
    setUser({ token: data.token, email: data.email, name: data.fullName, role: data.role });
    return data;
  };

  const register = async (payload) => {
    const { data } = await API.post("/auth/register", payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userName", data.fullName);
    localStorage.setItem("userRole", data.role);
    setUser({ token: data.token, email: data.email, name: data.fullName, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);