import { Suspense } from "react";
import { useAuth } from "./context/AuthContext";

import Login from "./views/Login";
import AdminDashboard from "./views/AdminDashboard";
import RevisorDashboard from "./views/RevisorDashboard";
import UserDashboard from "./views/UserDashboard";

const MainApp = () => {
  const { user } = useAuth();
  const role = user?.rol || "";

  return (
    <>
      {role === "" && <Login />}
      <Suspense fallback={<div>Cargando dashboard...</div>}></Suspense>
      {role === "admin" && <AdminDashboard />}
      {role === "revisor" && <RevisorDashboard />}
      {role === "usuario" && <UserDashboard />}
    </>
  );
};

export default MainApp;