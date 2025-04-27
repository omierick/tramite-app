import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../views/Login";
import AdminDashboard from "../views/AdminDashboard";
import RevisorDashboard from "../views/RevisorDashboard";
import UserDashboard from "../views/UserDashboard";

function AppRoutes() {
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