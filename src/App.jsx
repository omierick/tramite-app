import { useState, lazy, Suspense } from "react";
import { TramitesProvider } from "./context/TramitesContext";
import { DarkModeProvider } from "./context/DarkModeContext"; // << Nuevo

import Login from "./views/Login";
import AdminDashboard from "./views/AdminDashboard";
import RevisorDashboard from "./views/RevisorDashboard";
import UserDashboard from "./views/UserDashboard";

const App = () => {
  const [role, setRole] = useState("");

  return (
    <TramitesProvider>
      <DarkModeProvider>
        {role === "" && <Login setRole={setRole} />}
        <Suspense fallback={<div>Cargando dashboard...</div>}></Suspense>
        {role === "admin" && <AdminDashboard setRole={setRole} />}
        {role === "revisor" && <RevisorDashboard setRole={setRole} />}
        {role === "usuario" && <UserDashboard setRole={setRole} />}
      </DarkModeProvider>
    </TramitesProvider>
  );
};

export default App;