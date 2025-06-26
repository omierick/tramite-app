import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const UserManagement = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("revisor");
  const [areaId, setAreaId] = useState("");
  const [areas, setAreas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [editData, setEditData] = useState({
    nombre: "",
    correo: "",
    rol: "",
    password: "",
    area_id: null,
  });

  useEffect(() => {
    fetchUsuarios();
    fetchAreas();
  }, [user]);

  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*, areas:area_id (nombre)");

    if (!error) {
      const usuariosConArea = data.map((u) => ({
        ...u,
        area_nombre: u.areas?.nombre || "",
      }));
      setUsuarios(usuariosConArea);
    }
  };

  const fetchAreas = async () => {
    const { data, error } = await supabase
      .from("areas")
      .select("id_area, nombre");

    if (error) {
      console.error("Error al traer áreas", error);
      alert("Error al traer áreas: " + error.message);
    } else {
      const dataMapped = data.map((a) => ({ id: a.id_area, nombre: a.nombre }));
      setAreas(dataMapped);
    }
  };

  if (!user || (user.rol !== "admin" && user.rol !== "admin_usuarios")) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>No tienes permisos para ver esta página.</p>;
  }

  const handleCreate = async () => {
    if (!nombre || !email || !password || !rol) return alert("Faltan datos");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Correo inválido");
    if (password.length < 6) return alert("Contraseña debe tener al menos 6 caracteres");

    const { data: existente } = await supabase.from("usuarios").select("correo").eq("correo", email).single();
    if (existente) return alert("Correo ya registrado.");

    const nuevoUsuario = {
      nombre,
      correo: email,
      password,
      rol,
      ...(rol === "revisor" && areaId ? { area_id: parseInt(areaId) } : {}),
    };

    const { error } = await supabase.from("usuarios").insert([nuevoUsuario]);

    if (!error) {
      alert("Usuario creado");
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("revisor");
      setAreaId("");
      fetchUsuarios();
    } else {
      alert("Error al crear: " + error.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === "area_id" ? parseInt(value) : value,
    }));
  };

  const openEditModal = (usuario) => {
    setEditUser(usuario.correo);
    setEditData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      password: "",
      area_id: usuario.area_id || null,
    });
  };

  const handleUpdate = async () => {
    const { nombre, correo, rol, password, area_id } = editData;
    if (!nombre || !correo || !rol) return alert("Faltan datos");
    if (!/\S+@\S+\.\S+/.test(correo)) return alert("Correo inválido");

    const updateFields = { nombre, correo, rol };
    if (rol === "revisor" && area_id) updateFields.area_id = parseInt(area_id);
    else updateFields.area_id = null;

    if (password?.trim()) {
      if (password.length < 6) return alert("La contraseña debe tener al menos 6 caracteres");
      updateFields.password = password;
    }

    const { error } = await supabase.from("usuarios").update(updateFields).eq("correo", editUser);

    if (!error) {
      alert("Usuario actualizado");
      setEditUser(null);
      fetchUsuarios();
    } else {
      alert("Error al actualizar: " + error.message);
    }
  };

  const handleDeleteUser = async (correo) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmed) return;

    const { error } = await supabase.from("usuarios").delete().eq("correo", correo);
    if (!error) {
      alert("Usuario eliminado");
      fetchUsuarios();
    } else {
      alert("Error al eliminar: " + error.message);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) => u.nombre.toLowerCase().includes(filtro) || u.correo.toLowerCase().includes(filtro)
  );

  return (
    <div style={container}>
      <h2 style={heading}>Crear Usuario</h2>
      <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
      <input placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
      <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
      <select value={rol} onChange={(e) => setRol(e.target.value)} style={inputStyle}>
        <option value="revisor">revisor</option>
        <option value="admin">admin</option>
        <option value="admin_tramites">admin_tramites</option>
        <option value="admin_usuarios">admin_usuarios</option>
        <option value="admin_charts">admin_charts</option>
        <option value="usuario">usuario</option>
      </select>
      {rol === "revisor" && (
        <select value={areaId} onChange={(e) => setAreaId(e.target.value)} style={inputStyle}>
          <option value="">Selecciona un área</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>{area.nombre}</option>
          ))}
        </select>
      )}
      <button onClick={handleCreate} style={btnPrimary}>Crear</button>

      <h2 style={heading}>Usuarios Registrados</h2>
      <input
        placeholder="Buscar por nombre o correo"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value.toLowerCase())}
        style={{ ...inputStyle, marginBottom: "1rem" }}
      />

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={cellStyle}>Nombre</th>
              <th style={cellStyle}>Correo</th>
              <th style={cellStyle}>Rol</th>
              <th style={cellStyle}>Área</th>
              <th style={cellStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.correo}>
                <td style={cellStyle}>{u.nombre}</td>
                <td style={cellStyle}>{u.correo}</td>
                <td style={cellStyle}>{u.rol}</td>
                <td style={cellStyle}>{u.area_nombre}</td>
                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => openEditModal(u)} style={btnEdit}>Editar</button>
                    <button onClick={() => handleDeleteUser(u.correo)} style={btnDanger}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: "1rem" }}>Editar Usuario</h3>
            <input name="nombre" value={editData.nombre} onChange={handleEditChange} style={inputStyle} />
            <input name="correo" value={editData.correo} onChange={handleEditChange} style={inputStyle} />
            <input name="password" type="password" placeholder="Nueva contraseña (opcional)" value={editData.password} onChange={handleEditChange} style={inputStyle} />
            <select name="rol" value={editData.rol} onChange={handleEditChange} style={inputStyle}>
              <option value="revisor">revisor</option>
              <option value="admin">admin</option>
              <option value="admin_tramites">admin_tramites</option>
              <option value="admin_usuarios">admin_usuarios</option>
              <option value="admin_charts">admin_charts</option>
              <option value="usuario">usuario</option>
            </select>
            {editData.rol === "revisor" && (
              <select name="area_id" value={editData.area_id || ""} onChange={handleEditChange} style={inputStyle}>
                <option value="">Selecciona un área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginTop: "1rem" }}>
              <button onClick={handleUpdate} style={btnPrimary}>Guardar</button>
              <button onClick={() => setEditUser(null)} style={btnCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const container = {
  maxWidth: "700px",
  margin: "2rem auto",
  padding: "2rem",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const heading = { marginTop: "1rem", marginBottom: "1rem", color: "#111827" };
const inputStyle = { width: "100%", marginBottom: "0.5rem", padding: "0.6rem", borderRadius: "6px", border: "1px solid #d1d5db" };
const btnPrimary = { background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem", width: "100%", borderRadius: "6px", cursor: "pointer" };
const btnDanger = { background: "#ef4444", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const btnCancel = { background: "#9ca3af", color: "#fff", border: "none", padding: "0.6rem", width: "100%", borderRadius: "6px", cursor: "pointer" };
const btnEdit = { background: "#10b981", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "8px" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent = { background: "#fff", padding: "2rem", borderRadius: "10px", width: "90%", maxWidth: "400px", boxShadow: "0 0 15px rgba(0,0,0,0.2)" };

export default UserManagement;