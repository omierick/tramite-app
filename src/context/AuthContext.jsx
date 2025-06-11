import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";

const UserManagement = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userToDelete, setUserToDelete] = useState("");

  if (user?.role !== "admin") {
    return <p>No tienes permisos para ver esta página.</p>;
  }

  const handleCreate = async () => {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
    });
    if (error) return alert("Error: " + error.message);
    alert("Usuario creado: " + data.user.email);
  };

  const handleDelete = async () => {
    const { error } = await supabase.auth.admin.deleteUser(userToDelete);
    if (error) return alert("Error al eliminar: " + error.message);
    alert("Usuario eliminado");
  };

  return (
    <div>
      <h2>Crear Usuario</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleCreate}>Crear</button>

      <h2>Eliminar Usuario</h2>
      <input placeholder="User ID a eliminar" value={userToDelete} onChange={(e) => setUserToDelete(e.target.value)} />
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  );
};

export default UserManagement;