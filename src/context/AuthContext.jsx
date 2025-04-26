import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    if (username === "admin" && password === "admin123") {
      const newUser = { name: "Administrador", role: "admin" };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/");
    } else if (username === "revisor" && password === "revisor123") {
      const newUser = { name: "Revisor", role: "revisor" };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/");
    } else if (username === "usuario" && password === "usuario123") {
      const newUser = { name: "Usuario", role: "usuario" };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/");
    } else {
      return false;
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login"); // Redirige automáticamente
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};