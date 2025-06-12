import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Login con supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError || !data.user) {
      setError("Email o contraseña incorrectos");
      return;
    }

    // 2. Buscar usuario y rol en tu tabla usuarios
    let { data: usuario, error: userError } = await supabase
      .from("usuarios")
      .select("rol, nombre, id")
      .eq("correo", email)
      .single();

    if (userError || !usuario) {
      setError("No se encontró usuario con ese email.");
      return;
    }

    // 3. Guardar en el contexto
    login({
      email,
      nombre: usuario.nombre,
      id: usuario.id,
      rol: usuario.rol,
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Ingresar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Login;