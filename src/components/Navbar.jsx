// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useTramites } from "../context/TramitesContext";
import "./Navbar.css";

const Navbar = () => {
  const { setNombreUsuario, setRolUsuario } = useTramites();
  const navigate = useNavigate();

  const handleLogout = () => {
    setNombreUsuario("");
    setRolUsuario("");
    navigate("/"); // Redirige al login
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Sistema de Trámites</div>
      <div className="navbar-actions">
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;