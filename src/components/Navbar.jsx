// src/components/Navbar.jsx
import { useDarkMode } from "../context/DarkModeContext";
import { useTramites } from "../context/TramitesContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { nombreUsuario, setNombreUsuario, setRolUsuario } = useTramites();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setNombreUsuario("");
    setRolUsuario("");
    navigate("/");
  };

  const esLoginPage = location.pathname === "/";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>TrámitesApp</h1>
      </div>

      <div className="navbar-right">
        {!esLoginPage && (
          <>
            {nombreUsuario && (
              <span className="usuario-nombre">
                👤 {nombreUsuario}
              </span>
            )}
            <button className="btn-toggle-theme" onClick={toggleDarkMode}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;