import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./AreaManagement.css";

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [orden, setOrden] = useState({ columna: "id_area", asc: true });
  const itemsPorPagina = 10;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [editAreaId, setEditAreaId] = useState(null);
  const [editData, setEditData] = useState({
    id_area: "",
    nombre: "",
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

  const handleCrearArea = async () => {
    if (!nombre) {
      alert("El nombre es obligatorio.");
      return;
    }

    const nuevaArea = { nombre, descripcion };

    const { error } = await supabase.from("areas").insert([nuevaArea]);
    if (error) {
      console.error(error);
      return alert("Error al guardar el área.");
    }

    fetchAreas();
    setNombre("");
    setDescripcion("");
  };

  const abrirModalEdicion = (area) => {
    setEditAreaId(area.id_area);
    setEditData({
      id_area: area.id_area,
      nombre: area.nombre,
      descripcion: area.descripcion,
    });
  };

  const guardarEdicion = async () => {
    if (!editData.nombre) {
      alert("El nombre es obligatorio.");
      return;
    }

    const { error } = await supabase
      .from("areas")
      .update({ nombre: editData.nombre, descripcion: editData.descripcion })
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

  const areasFiltradas = areas
    .filter((a) => {
      const filtroLower = filtro.toLowerCase();
      return (
        a.nombre.toLowerCase().includes(filtroLower) ||
        a.descripcion.toLowerCase().includes(filtroLower) ||
        a.id_area.toString().includes(filtroLower)
      );
    })
    .sort((a, b) => {
      const campoA = a[orden.columna];
      const campoB = b[orden.columna];

      if (orden.columna === "id_area") {
        return orden.asc ? campoA - campoB : campoB - campoA;
      }

      if (typeof campoA === "string" && typeof campoB === "string") {
        return orden.asc
          ? campoA.localeCompare(campoB)
          : campoB.localeCompare(campoA);
      }

      return 0;
    });

  const totalPaginas = Math.ceil(areasFiltradas.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const paginados = areasFiltradas.slice(inicio, inicio + itemsPorPagina);

  const cambiarPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
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

  return (
    <div className="area-container">
      <h2 className="area-heading">Crear Nueva Área</h2>
      <input className="area-input" placeholder="Nombre del Área" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input className="area-input" placeholder="Descripción general" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      <button className="area-btn-primary" onClick={handleCrearArea}>Crear</button>

      <h2 className="area-heading">Áreas Registradas</h2>
      <input
        className="area-input"
        placeholder="Buscar por ID, nombre o descripción"
        value={filtro}
        onChange={(e) => {
          setFiltro(e.target.value);
          setPaginaActual(1);
        }}
      />

      <div className="area-table-wrapper">
        <table className="area-table">
          <thead>
            <tr>
              <th onClick={() => ordenarPor("id_area")}>ID {iconoOrden("id_area")}</th>
              <th onClick={() => ordenarPor("nombre")}>Nombre {iconoOrden("nombre")}</th>
              <th onClick={() => ordenarPor("descripcion")}>Descripción {iconoOrden("descripcion")}</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginados.map((a) => (
              <tr key={a.id_area}>
                <td>{a.id_area}</td>
                <td>{a.nombre}</td>
                <td>{a.descripcion}</td>
                <td>
                  <div className="area-actions">
                    <button className="area-btn-edit" onClick={() => abrirModalEdicion(a)}>Editar</button>
                    <button className="area-btn-danger" onClick={() => eliminarArea(a.id_area)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {paginados.length === 0 && (
              <tr>
                <td colSpan="4" className="area-no-results">
                  No se encontraron resultados.
                </td>
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

      {editAreaId && (
        <div className="area-modal-overlay">
          <div className="area-modal-content">
            <h3 className="area-modal-title">Editar Área</h3>
            <input
              className="area-input"
              name="id_area"
              value={editData.id_area}
              disabled
            />
            <input
              className="area-input"
              name="nombre"
              value={editData.nombre}
              onChange={handleEditChange}
              placeholder="Nombre"
            />
            <input
              className="area-input"
              name="descripcion"
              value={editData.descripcion}
              onChange={handleEditChange}
              placeholder="Descripción"
            />
            <div className="area-modal-actions">
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