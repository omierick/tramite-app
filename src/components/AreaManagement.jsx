import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import "./AreaManagement.css";

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [nombre, setNombre] = useState("");
  const [responsable, setResponsable] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [editAreaId, setEditAreaId] = useState(null);
  const [editData, setEditData] = useState({
    nombre: "",
    responsable: "",
    correo: "",
    telefono: "",
    ubicacion: "",
    descripcion: "",
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    const { data, error } = await supabase.from("areas").select("*");
    if (!error) setAreas(data);
    else console.error("Error al cargar áreas:", error);
  };

  const correoValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  const telefonoValido = (valor) => /^\d+$/.test(valor);

  const handleCrearArea = async () => {
    if (!nombre || !responsable || !correo || !telefono) {
      alert("Todos los campos obligatorios deben ser completados.");
      return;
    }

    if (!correoValido(correo)) {
      alert("Correo inválido.");
      return;
    }

    if (!telefonoValido(telefono)) {
      alert("El teléfono debe contener solo números.");
      return;
    }

    const nuevaArea = {
      nombre,
      responsable,
      correo,
      telefono,
      ubicacion,
      descripcion,
    };

    const { error } = await supabase.from("areas").insert([nuevaArea]);
    if (error) {
      console.error(error);
      return alert("Error al guardar el área.");
    }

    fetchAreas();
    setNombre("");
    setResponsable("");
    setCorreo("");
    setTelefono("");
    setUbicacion("");
    setDescripcion("");
  };

  const abrirModalEdicion = (area) => {
    setEditAreaId(area.id_area);
    setEditData({
      nombre: area.nombre,
      responsable: area.responsable,
      correo: area.correo,
      telefono: area.telefono,
      ubicacion: area.ubicacion,
      descripcion: area.descripcion,
    });
  };

  const guardarEdicion = async () => {
    const { nombre, responsable, correo, telefono } = editData;

    if (!nombre || !responsable || !correo || !telefono) {
      alert("Todos los campos obligatorios deben ser completados.");
      return;
    }

    if (!correoValido(correo)) {
      alert("Correo inválido.");
      return;
    }

    if (!telefonoValido(telefono)) {
      alert("El teléfono debe contener solo números.");
      return;
    }

    const { error } = await supabase
      .from("areas")
      .update(editData)
      .eq("id_area", editAreaId);

    if (error) {
      console.error(error);
      return alert("Error al guardar cambios.");
    }

    fetchAreas();
    setEditAreaId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const eliminarArea = async (id_area) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta área?");
    if (!confirmar) return;

    const { error } = await supabase.from("areas").delete().eq("id_area", id_area);
    if (error) {
      console.error(error);
      alert("No se pudo eliminar el área.");
    } else {
      fetchAreas();
    }
  };

  const areasFiltradas = areas.filter(
    (a) =>
      a.nombre.toLowerCase().includes(filtro) ||
      a.responsable.toLowerCase().includes(filtro)
  );

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
      <input
        className="area-input"
        placeholder="Buscar por nombre o responsable"
        value={filtro}
        onChange={(e) => {
          setFiltro(e.target.value.toLowerCase());
          setPaginaActual(1);
        }}
      />

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
              <tr key={a.id_area}>
                <td>{a.nombre}</td>
                <td>{a.responsable}</td>
                <td>{a.correo}</td>
                <td>{a.telefono}</td>
                <td>{a.ubicacion}</td>
                <td>{a.descripcion}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="area-btn-edit" onClick={() => abrirModalEdicion(a)}>Editar</button>
                    <button className="area-btn-danger" onClick={() => eliminarArea(a.id_area)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginados.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                  No se encontraron resultados.
                </td>
              </tr>
            )}
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

      {editAreaId && (
        <div className="area-modal-overlay">
          <div className="area-modal-content">
            <h3 style={{ marginBottom: "1rem" }}>Editar Área</h3>
            {Object.entries(editData).map(([key, value]) => (
              <input
                key={key}
                className="area-input"
                name={key}
                value={value}
                onChange={handleEditChange}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                disabled={key === "id_area"}
              />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginTop: "1rem" }}>
              <button className="area-btn-primary" onClick={guardarEdicion}>Guardar</button>
              <button className="area-btn-cancel" onClick={() => setEditAreaId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManagement;
