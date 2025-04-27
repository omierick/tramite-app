import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useTramites } from "../context/TramitesContext";
import "./Login.css";

const Login = ({ setRole }) => {
  const [usuarios, setUsuarios] = useState([]);
  const { setNombreUsuario } = useTramites();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from("usuarios").select("*");
      if (error) console.error("Error cargando usuarios:", error);
      else setUsuarios(data || []);
    };
    fetchUsuarios();
  }, []);

  const handleLogin = (usuario) => {
    setNombreUsuario(usuario.nombre);
    setRole(usuario.rol); // 👈 Ya sabes si es admin, revisor o usuario
  };

  return (
    <div className="login-container">
      <h2>Selecciona tu usuario para iniciar sesión</h2>
      <div className="usuarios-grid">
        {usuarios.map((usuario) => (
          <button key={usuario.id} onClick={() => handleLogin(usuario)}>
            {usuario.nombre} ({usuario.rol})
          </button>
        ))}
      </div>
    </div>
  );
};

export default Login;