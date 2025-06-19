import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const UserManagement = () => {
  const { user } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("revisor");
  const [userToDelete, setUserToDelete] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from("usuarios").select("*");
      if (error) {
        console.error("Error al obtener usuarios:", error.message);
      } else {
        setUsuarios(data);
      }
    };

    fetchUsuarios();
  }, [user]);

  if (!user || (user.rol !== "admin" && user.rol !== "admin_usuarios")) {
    return <p>No tienes permisos para ver esta página.</p>;
  }

  const handleCreate = async () => {
    if (!nombre || !email || !password || !rol) return alert("Faltan datos");

    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ nombre, correo: email, password, rol }]);

    if (error) return alert("Error al crear usuario: " + error.message);
    alert("Usuario creado exitosamente: " + email);
    setNombre("");
    setEmail("");
    setPassword("");
    setRol("revisor");
  };

  const handleDelete = async () => {
    if (!userToDelete) return alert("Escribe un correo para eliminar.");

    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("correo", userToDelete);

    if (error) {
      console.error("Error al eliminar usuario:", error.message);
      alert("Error al eliminar: " + error.message);
    } else {
      alert("Usuario eliminado correctamente.");
      setUserToDelete("");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", background: "#fff", padding: "2rem", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2>Crear Usuario</h2>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />
      <input
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />
      <select
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      >
        <option value="revisor">revisor</option>
        <option value="admin">admin</option>
        <option value="admin_tramites">admin_tramites</option>
        <option value="admin_usuarios">admin_usuarios</option>
        <option value="admin_charts">admin_charts</option>
      </select>
      <button
        onClick={handleCreate}
        style={{ background: "#2563eb", color: "#fff", border: "none", width: "100%", padding: "0.6rem", borderRadius: "5px", cursor: "pointer" }}
      >
        Crear
      </button>

      <h2 style={{ marginTop: "2rem" }}>Eliminar Usuario</h2>
      <input
        placeholder="Correo del usuario a eliminar"
        value={userToDelete}
        onChange={(e) => setUserToDelete(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />
      <button
        onClick={handleDelete}
        style={{ background: "#ef4444", color: "#fff", border: "none", width: "100%", padding: "0.6rem", borderRadius: "5px", cursor: "pointer" }}
      >
        Eliminar
      </button>

      <h2 style={{ marginTop: "2rem" }}>Usuarios Registrados</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nombre</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Correo</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.correo}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.nombre}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.correo}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;