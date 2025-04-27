import { useState, lazy, Suspense } from "react";
import { TramitesProvider } from "./context/TramitesContext";
import Login from "./views/Login";

// Lazy load de los dashboards pesados
const AdminDashboard = lazy(() => import("./views/AdminDashboard"));
const RevisorDashboard = lazy(() => import("./views/RevisorDashboard"));
const UserDashboard = lazy(() => import("./views/UserDashboard"));

function App() {
  const [role, setRole] = useState(""); // Rol que maneja el login (admin, revisor, usuario)

  return (
    <TramitesProvider>
      {role === "" && <Login setRole={setRole} />}
      <Suspense fallback={<div>Cargando dashboard...</div>}>
        {role === "admin" && <AdminDashboard setRole={setRole} />}
        {role === "revisor" && <RevisorDashboard setRole={setRole} />}
        {role === "usuario" && <UserDashboard setRole={setRole} />}
      </Suspense>
    </TramitesProvider>
  );
}

export default App;