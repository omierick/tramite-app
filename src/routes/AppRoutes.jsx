import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import RevisorDashboard from "../pages/RevisorDashboard";
import UserDashboard from "../pages/UserDashboard";

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {user.role === "admin" && (
        <>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
      {user.role === "revisor" && (
        <>
          <Route path="/" element={<RevisorDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
      {user.role === "usuario" && (
        <>
          <Route path="/" element={<UserDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;

