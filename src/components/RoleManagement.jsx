import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./AreaManagement.css"; // reutilizamos los estilos

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [orden, setOrden] = useState({ columna: "id", asc: true });
  const [editRolId, setEditRolId] = useState(null);
  const [editData, setEditData] = useState({ id: "", nombre: "", descripcion: "" });
  const itemsPorPagina = 10;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const { data, error } = await supabase.from("roles").select("*");
    if (!error) setRoles(data);
  };

  const handleCrear = async () => {
    if (!nombre.trim()) return alert("El nombre es obligatorio.");
    const { error } = await supabase.from("roles").insert([{ nombre, descripcion }]);
    if (error) alert("Error al crear rol.");
    else {
      fetchRoles();
      setNombre("");
      setDescripcion("");
    }
  };

  const abrirEdicion = (rol) => {
    setEditRolId(rol.id);
    setEditData(rol);
  };

  const guardarEdicion = async () => {
    if (!editData.nombre.trim()) return alert("El nombre es obligatorio.");
    const { error } = await supabase
      .from("roles")
      .update({ nombre: editData.nombre, descripcion: editData.descripcion })
      .eq("id", editRolId);
    if (!error) {
      fetchRoles();
      setEditRolId(null);
    } else {
      alert("Error al actualizar rol.");
    }
  };

  const eliminarRol = async (id) => {
    const { data } = await supabase.from("usuarios").select("rol_id").eq("rol_id", id);
    if (data && data.length > 0) {
      alert("Este rol está en uso y no puede ser eliminado.");
      return;
    }
    if (!window.confirm("¿Deseas eliminar este rol?")) return;
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (!error) fetchRoles();
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const ordenarPor = (columna) => {
    setOrden((prev) => ({
      columna,
      asc: prev.columna === columna ? !prev.asc : true,
    }));
  };

  const iconoOrden = (columna) => {
    if (orden.columna !== columna) return <FaSort />;
    return orden.asc ? <FaSortUp /> : <FaSortDown />;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const filtrados = roles
    .filter((r) => {
      const f = filtro.toLowerCase();
      return (
        r.nombre.toLowerCase().includes(f) ||
        r.descripcion.toLowerCase().includes(f) ||
        r.id.toString().includes(f)
      );
    })
    .sort((a, b) => {
      const aVal = a[orden.columna];
      const bVal = b[orden.columna];
      if (typeof aVal === "number") return orden.asc ? aVal - bVal : bVal - aVal;
      return orden.asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const totalPaginas = Math.ceil(filtrados.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const paginados = filtrados.slice(inicio, inicio + itemsPorPagina);

  return (
    <div className="area-container">
      <h2 className="area-heading">Crear Nuevo Rol</h2>
      <input className="area-input" placeholder="Nombre del Rol" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input className="area-input" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <button className="area-btn-primary" onClick={handleCrear}>Crear</button>

      <h2 className="area-heading">Roles Registrados</h2>
      <input
        className="area-input"
        placeholder="Buscar por ID, nombre o descripción"
        value={filtro}
        onChange={(e) => { setFiltro(e.target.value); setPaginaActual(1); }}
      />

      <div className="area-table-wrapper">
        <table className="area-table">
          <thead>
            <tr>
              <th onClick={() => ordenarPor("id")}>ID {iconoOrden("id")}</th>
              <th onClick={() => ordenarPor("nombre")}>Nombre {iconoOrden("nombre")}</th>
              <th onClick={() => ordenarPor("descripcion")}>Descripción {iconoOrden("descripcion")}</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginados.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td>{r.descripcion}</td>
                <td>
                  <div className="area-actions">
                    <button className="area-btn-edit" onClick={() => abrirEdicion(r)}>Editar</button>
                    <button className="area-btn-danger" onClick={() => eliminarRol(r.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginados.length === 0 && (
              <tr>
                <td colSpan="4" className="area-no-results">No se encontraron resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="area-pagination">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="area-page-btn"
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            className={`area-page-btn ${paginaActual === i + 1 ? "active" : ""}`}
            onClick={() => cambiarPagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="area-page-btn"
        >
          <FaChevronRight />
        </button>
      </div>

      {editRolId && (
        <div className="area-modal-overlay">
          <div className="area-modal-content">
            <h3 className="area-modal-title">Editar Rol</h3>
            <input className="area-input" name="id" value={editData.id} disabled />
            <input className="area-input" name="nombre" value={editData.nombre} onChange={handleEditChange} placeholder="Nombre" />
            <input className="area-input" name="descripcion" value={editData.descripcion} onChange={handleEditChange} placeholder="Descripción" />
            <div className="area-modal-actions">
              <button className="area-modal-btn area-btn-primary" onClick={guardarEdicion}>Guardar</button>
              <button className="area-modal-btn area-btn-cancel" onClick={() => setEditRolId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
