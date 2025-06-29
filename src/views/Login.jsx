import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useTramites } from "../context/TramitesContext"; // ✅ agregado
import { supabase } from "../services/supabaseClient";
import "./Login.css";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setCorreoUsuario, setNombreUsuario, setRolUsuario } = useTramites(); // ✅ agregado

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correo)
      .single();

    if (error || !data) {
      toast.error("Correo no registrado.");
      return;
    }

    if (data.password !== password) {
      toast.error("Contraseña incorrecta.");
      return;
    }

    // ✅ Guardamos el usuario en el contexto
    setCorreoUsuario(data.correo);
    setNombreUsuario(data.nombre);
    setRolUsuario(data.rol);

    login({
      id: data.id,
      nombre: data.nombre,
      rol: data.rol,
      correo: data.correo,
    });

    const rol = data.rol.toLowerCase();

    if (rol.startsWith("admin")) {
      navigate("/admin");
    } else if (rol.includes("revisor")) {
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
        <button type="submit" className="btn-login">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;