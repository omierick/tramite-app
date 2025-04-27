import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const { setNombreUsuario, setRolUsuario, buscarUsuarioPorCorreo } = useTramites();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await buscarUsuarioPorCorreo(correo);

    if (error || !data) {
      toast.error("Correo no registrado.");
      return;
    }

    if (data.password !== password) {
      toast.error("Contraseña incorrecta.");
      return;
    }

    setNombreUsuario(data.nombre);
    setRolUsuario(data.rol);

    // Redirigir según el rol
    if (data.rol === "admin") {
      navigate("/admin");
    } else if (data.rol === "revisor") {
      navigate("/revisor");
    } else {
      navigate("/usuario");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>

        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-login">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;