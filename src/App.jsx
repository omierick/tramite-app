import { useState } from "react";
import { TramitesProvider } from "./context/TramitesContext";
import Login from "./views/Login";
import AdminDashboard from "./views/AdminDashboard";
import RevisorDashboard from "./views/RevisorDashboard";
import UserDashboard from "./views/UserDashboard";

function App() {
  const [role, setRole] = useState(""); // Rol que maneja el login (admin, revisor, usuario)

  return (
    <TramitesProvider>
      {role === "" && <Login setRole={setRole} />}
      {role === "admin" && <AdminDashboard setRole={setRole} />}
      {role === "revisor" && <RevisorDashboard setRole={setRole} />}
      {role === "usuario" && <UserDashboard setRole={setRole} />}
    </TramitesProvider>
  );
}

export default App;