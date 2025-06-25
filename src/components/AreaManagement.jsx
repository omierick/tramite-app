import { useState } from "react";
import "./AreaManagement.css";

const registrosIniciales = [...Array(30)].map((_, i) => ({
  id: i + 1,
  nombre: `Área ${i + 1}`,
  responsable: `Responsable ${i + 1}`,
  correo: `area${i + 1}@omieave.com`,
  telefono: `555-10${String(i + 1).padStart(2, "0")}`,
  ubicacion: `Edificio ${String.fromCharCode(65 + (i % 10))}`,
  descripcion: `Descripción del área ${i + 1}`,
}));

const AreaManagement = () => {
  const [areas, setAreas] = useState(registrosIniciales);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [nombre, setNombre] = useState("");
  const [responsable, setResponsable] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [editArea, setEditArea] = useState(null);
  const [editData, setEditData] = useState({
    nombre: "",
    responsable: "",
    correo: "",
    telefono: "",
    ubicacion: "",
    descripcion: ""
  });

  const handleCrearArea = () => {
    if (!nombre || !responsable || !correo) return alert("Faltan campos obligatorios");
    const nuevaArea = {
      id: areas.length + 1,
      nombre, responsable, correo, telefono, ubicacion, descripcion,
    };
    setAreas([...areas, nuevaArea]);
    setNombre(""); setResponsable(""); setCorreo(""); setTelefono(""); setUbicacion(""); setDescripcion("");
  };

  const abrirModalEdicion = (area) => {
    setEditArea(area.id);
    setEditData({ ...area });
  };

  const guardarEdicion = () => {
    setAreas((prev) => prev.map((a) => (a.id === editArea ? { ...editData, id: a.id } : a)));
    setEditArea(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const eliminarArea = (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta área?");
    if (!confirmar) return;
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const areasFiltradas = areas.filter((a) => a.nombre.toLowerCase().includes(filtro) || a.responsable.toLowerCase().includes(filtro));
  const totalPaginas = Math.ceil(areasFiltradas.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const paginados = areasFiltradas.slice(inicio, inicio + itemsPorPagina);

  const cambiarPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
  };

  return (
    <div className="area-container">
      <h2 className="area-heading">Crear Nueva Área</h2>
      <input className="area-input" placeholder="Nombre del Área" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input className="area-input" placeholder="Responsable del Área" value={responsable} onChange={(e) => setResponsable(e.target.value)} />
      <input className="area-input" placeholder="Correo institucional" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <input className="area-input" placeholder="Teléfono de contacto" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      <input className="area-input" placeholder="Ubicación física" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
      <input className="area-input" placeholder="Descripción general" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <button className="area-btn-primary" onClick={handleCrearArea}>Crear</button>

      <h2 className="area-heading">Áreas Registradas</h2>
      <input className="area-input" placeholder="Buscar por nombre o responsable" value={filtro} onChange={(e) => { setFiltro(e.target.value.toLowerCase()); setPaginaActual(1); }} />

      <div className="area-table-wrapper">
        <table className="area-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Responsable</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginados.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre}</td>
                <td>{a.responsable}</td>
                <td>{a.correo}</td>
                <td>{a.telefono}</td>
                <td>{a.ubicacion}</td>
                <td>{a.descripcion}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="area-btn-edit" onClick={() => abrirModalEdicion(a)}>Editar</button>
                    <button className="area-btn-danger" onClick={() => eliminarArea(a.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginados.length === 0 && <tr><td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>No se encontraron resultados.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="area-pagination">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            className={`area-page-btn ${paginaActual === i + 1 ? "active" : ""}`}
            onClick={() => cambiarPagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {editArea && (
        <div className="area-modal-overlay">
          <div className="area-modal-content">
            <h3 style={{ marginBottom: "1rem" }}>Editar Área</h3>
            {Object.keys(editData).map((key) => (
              <input
                key={key}
                className="area-input"
                name={key}
                value={editData[key]}
                onChange={handleEditChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginTop: "1rem" }}>
              <button className="area-btn-primary" onClick={guardarEdicion}>Guardar</button>
              <button className="area-btn-cancel" onClick={() => setEditArea(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManagement;
