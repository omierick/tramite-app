// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDarkMode } from "../context/DarkModeContext";

import Login from "../views/Login";
import AdminDashboard from "../views/AdminDashboard";
import RevisorDashboard from "../views/RevisorDashboard";
import UserDashboard from "../views/UserDashboard";

function AppRoutes() {
  const { isDarkMode } = useDarkMode(); // 👈 consumir el contexto

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/revisor" element={<RevisorDashboard />} />
        <Route path="/usuario" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;