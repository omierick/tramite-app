import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import "./UserManagement.css";

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
  const [editData, setEditData] = useState({ id: null, nombre: "", correo: "", rol: "", password: "", area_id: null });
  const [itemsPorPagina, setItemsPorPagina] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [orden, setOrden] = useState({ campo: "id", asc: true });

  useEffect(() => {
    fetchUsuarios();
    fetchAreas();
  }, [user]);

  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from("usuarios").select("*, areas:area_id (nombre)");
    if (!error) {
      const usuariosConArea = data.map((u) => ({ ...u, area_nombre: u.areas?.nombre || "" }));
      usuariosConArea.sort((a, b) => a.id - b.id);
      setUsuarios(usuariosConArea);
    }
  };

  const fetchAreas = async () => {
    const { data, error } = await supabase.from("areas").select("id_area, nombre");
    if (!error) {
      setAreas(data.map((a) => ({ id: a.id_area, nombre: a.nombre })));
    }
  };

  const handleCreate = async () => {
    if (!nombre || !email || !password || !rol) return alert("Faltan datos");
    if (!/\S+@\S+\.\S+/.test(email)) return alert("Correo inválido");
    if (password.length < 6) return alert("Contraseña debe tener al menos 6 caracteres");

    const { data: existente } = await supabase.from("usuarios").select("correo").eq("correo", email).single();
    if (existente) return alert("Correo ya registrado.");

    const nuevoUsuario = { nombre, correo: email, password, rol, ...(rol === "revisor" && areaId ? { area_id: parseInt(areaId) } : {}) };
    const { error } = await supabase.from("usuarios").insert([nuevoUsuario]);
    if (!error) {
      alert("Usuario creado");
      setNombre(""); setEmail(""); setPassword(""); setRol("revisor"); setAreaId("");
      fetchUsuarios();
    } else alert("Error al crear: " + error.message);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: name === "area_id" ? parseInt(value) : value }));
  };

  const openEditModal = (usuario) => {
    setEditUser(usuario.correo);
    setEditData({ id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, password: "", area_id: usuario.area_id });
  };

  const handleUpdate = async () => {
    const { nombre, correo, rol, password, area_id } = editData;
    if (!nombre || !correo || !rol) return alert("Faltan datos");
    if (!/\S+@\S+\.\S+/.test(correo)) return alert("Correo inválido");

    const updateFields = { nombre, correo, rol, area_id: rol === "revisor" ? parseInt(area_id) : null };
    if (password?.trim()) {
      if (password.length < 6) return alert("La contraseña debe tener al menos 6 caracteres");
      updateFields.password = password;
    }

    const { error } = await supabase.from("usuarios").update(updateFields).eq("correo", editUser);
    if (!error) {
      alert("Usuario actualizado");
      setEditUser(null);
      fetchUsuarios();
    } else alert("Error al actualizar: " + error.message);
  };

  const handleDeleteUser = async (correo) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    const { error } = await supabase.from("usuarios").delete().eq("correo", correo);
    if (!error) fetchUsuarios();
    else alert("Error al eliminar: " + error.message);
  };

  const usuariosFiltrados = usuarios
    .filter((u) =>
      u.nombre.toLowerCase().includes(filtro) ||
      u.correo.toLowerCase().includes(filtro) ||
      u.id.toString().includes(filtro)
    )
    .sort((a, b) => {
      const campo = orden.campo;
      const valorA = a[campo];
      const valorB = b[campo];
      if (campo === "id") return orden.asc ? valorA - valorB : valorB - valorA;
      return orden.asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
    });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / itemsPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const cambiarOrden = (campo) => {
    setOrden((prev) => ({ campo, asc: prev.campo === campo ? !prev.asc : true }));
  };

  if (!user || (user.rol !== "admin" && user.rol !== "admin_usuarios")) return <p style={{ textAlign: "center" }}>No tienes permisos para ver esta página.</p>;

  return (
    <div className="user-management">
      <h2>Crear Usuario</h2>
      <div className="form-group">
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="admin">admin</option>
          <option value="admin_charts">admin_charts</option>
          <option value="admin_revisor">admin_revisor</option>
          <option value="admin_tramites">admin_tramites</option>
          <option value="admin_usuarios">admin_usuarios</option>
          <option value="revisor">revisor</option>
          <option value="usuario">usuario</option>
        </select>
        {rol === "revisor" && (
          <select value={areaId} onChange={(e) => setAreaId(e.target.value)}>
            <option value="">Selecciona un área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>{area.nombre}</option>
            ))}
          </select>
        )}
        <button className="btn-primary" onClick={handleCreate}>Crear</button>
      </div>

      <h2>Usuarios Registrados</h2>
      <input
        placeholder="Buscar por ID, nombre o correo"
        value={filtro}
        onChange={(e) => { setFiltro(e.target.value.toLowerCase()); setPaginaActual(1); }}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => cambiarOrden("id")}>ID</th>
              <th onClick={() => cambiarOrden("nombre")}>Nombre</th>
              <th onClick={() => cambiarOrden("correo")}>Correo</th>
              <th onClick={() => cambiarOrden("rol")}>Rol</th>
              <th>Área</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map((u) => (
              <tr key={u.correo}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{u.area_nombre}</td>
                <td className="user-actions">
                  <button className="btn-edit" onClick={() => openEditModal(u)}>Editar</button>
                  <button className="btn-danger" onClick={() => handleDeleteUser(u.correo)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button onClick={() => setPaginaActual((p) => Math.max(1, p - 1))} disabled={paginaActual === 1}>{"<"}</button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button key={i} onClick={() => setPaginaActual(i + 1)} className={paginaActual === i + 1 ? "active" : ""}>{i + 1}</button>
        ))}
        <button onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas}>{">"}</button>
      </div>

       {editUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <input value={editData.id} disabled />
            <input name="nombre" value={editData.nombre} onChange={handleEditChange} />
            <input name="correo" value={editData.correo} onChange={handleEditChange} />
            <input name="password" type="password" placeholder="Nueva contraseña (opcional)" value={editData.password} onChange={handleEditChange} />
            <select name="rol" value={editData.rol} onChange={handleEditChange}>
              <option value="revisor">revisor</option>
              <option value="admin">admin</option>
              <option value="admin_tramites">admin_tramites</option>
              <option value="admin_usuarios">admin_usuarios</option>
              <option value="admin_charts">admin_charts</option>
              <option value="usuario">usuario</option>
            </select>
            {editData.rol === "revisor" && (
              <select name="area_id" value={editData.area_id || ""} onChange={handleEditChange}>
                <option value="">Selecciona un área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.nombre}</option>
                ))}
              </select>
            )}
            <div className="modal-buttons">
              <button className="btn-guardar" onClick={handleUpdate}>Guardar</button>
              <button className="btn-cancelar" onClick={() => setEditUser(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
