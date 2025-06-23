import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import { generatePDF } from "../utils/pdfUtils";
import { sendTramiteEmail } from "../services/emailService";
import "./RevisorDashboard.css";

const RevisorDashboard = () => {
  const { tramites, updateTramiteEstado, setNombreUsuario, setRolUsuario } = useTramites();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  const [comentario, setComentario] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [orden, setOrden] = useState("recientes");

  const handleAprobar = async (id) => {
    updateTramiteEstado(id, "Aprobado");

    const tramite = tramites.find(t => t.id === id);
    if (tramite) {
      await sendTramiteEmail({ ...tramite, estado: "Aprobado" });
    }

    setTramiteSeleccionado(null);
    setComentario("");
  };

  const handleRechazar = async (id) => {
    updateTramiteEstado(id, "Rechazado", comentario);

    const tramite = tramites.find(t => t.id === id);
    if (tramite) {
      await sendTramiteEmail({
        ...tramite,
        estado: "Rechazado",
        comentarioRevisor: comentario,
      });
    }

    setComentario("");
    setTramiteSeleccionado(null);
  };

  const handleCerrarSesion = () => {
    setNombreUsuario("");
    setRolUsuario("");
  };

  const handleVerDetalles = (tramite) => {
    setComentario("");
    setTramiteSeleccionado(tramite);
  };

  const tramitesFiltrados = tramites
    .filter((t) => {
      if (filtroEstado !== "todos" && t.estado !== filtroEstado) return false;
      return (
        (t.folio ?? "").toString().toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.tipo ?? "").toString().toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.solicitante ?? "").toString().toLowerCase().includes(busqueda.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (orden === "recientes") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (orden === "antiguos") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (orden === "tipo") {
        return (a.tipo ?? "").localeCompare(b.tipo ?? "");
      }
      return 0;
    });

  return (
    <>
      <Navbar />
      <div className="revisor-container">
        <h2>Revisión de Trámites</h2>

        <div className="filtros-container">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Aprobado">Aprobados</option>
            <option value="Rechazado">Rechazados</option>
          </select>

          <input
            type="text"
            placeholder="Buscar por solicitante o tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="filtro-select"
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="tipo">Ordenar por tipo</option>
          </select>
        </div>

        {tramitesFiltrados.length === 0 ? (
          <div className="no-tramites">No hay trámites pendientes 🚀</div>
        ) : (
          <table className="tabla-revisor">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Tipo de Trámite</th>
                <th>Solicitante</th>
                <th>Estado</th>
                <th>Fecha de Solicitud</th>
                <th>Fecha de Revisión</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramitesFiltrados.map((tramite) => (
                <tr key={tramite.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {tramite.folio || "Sin folio"}
                  </td>
                  <td>{tramite.tipo}</td>
                  <td>{tramite.solicitante || "No especificado"}</td>
                  <td className={`estado ${tramite.estado.toLowerCase()}`}>{tramite.estado}</td>
                  <td>{new Date(tramite.createdAt).toLocaleDateString()}</td>
                  <td>
                    {tramite.reviewedAt
                      ? new Date(tramite.reviewedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="acciones">
                    <button className="btn-ver" onClick={() => handleVerDetalles(tramite)}>Ver Detalles</button>
                    <button className="btn-aprobar" onClick={() => handleAprobar(tramite.id)}>Aprobar</button>
                    <button className="btn-rechazar" onClick={() => handleRechazar(tramite.id)}>Rechazar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tramiteSeleccionado && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target.classList.contains('modal-overlay')) {
              setTramiteSeleccionado(null);
              setComentario("");
            }
          }}>
            <div className="modal-content">
              <h2>Municipalidad de Ejemplo</h2>
              <p className="subtitulo">Documento Validado de Trámite</p>
              <hr />

              <h3>Datos del Trámite</h3>
<table className="tabla-detalle">
  <tbody>
    <tr>
      <th>Folio</th>
      <td>{tramiteSeleccionado.folio || "Sin folio"}</td>
    </tr>
    <tr>
      <th>Tipo de Trámite</th>
      <td>{tramiteSeleccionado.tipo}</td>
    </tr>
    <tr>
      <th>Fecha de Solicitud</th>
      <td>{new Date(tramiteSeleccionado.createdAt).toLocaleDateString()}</td>
    </tr>
    <tr>
      <th>
        {tramiteSeleccionado.estado === "Aprobado"
          ? "Fecha de Aprobación"
          : tramiteSeleccionado.estado === "Rechazado"
            ? "Fecha de Rechazo"
            : "Fecha de Validación"}
      </th>
      <td>
        {tramiteSeleccionado.reviewedAt
          ? new Date(tramiteSeleccionado.reviewedAt).toLocaleDateString()
          : "-"}
      </td>
    </tr>
    <tr>
      <th>Estado</th>
      <td>{tramiteSeleccionado.estado}</td>
    </tr>
  </tbody>
</table>


              <h3>Datos del Solicitante</h3>
              <table className="tabla-detalle">
                <tbody>
                  <tr>
                    <th>Nombre Completo</th>
                    <td>{tramiteSeleccionado.solicitante || "-"}</td>
                  </tr>
                </tbody>
              </table>

              {tramiteSeleccionado.firma && (
                <>
                  <h3>Firma del Solicitante</h3>
                  <div className="firma-preview-container">
                    <img src={tramiteSeleccionado.firma} alt="Firma" className="firma-img" />
                  </div>
                </>
              )}

              <div className="comentario-revisor">
  <label htmlFor="comentario">Comentario del Revisor (opcional):</label>

  {tramiteSeleccionado.estado === "Rechazado" && tramiteSeleccionado.comentario_revisor ? (
    <div
      style={{
        whiteSpace: "pre-wrap",
        backgroundColor: "#fff8f8",
        border: "1px solid #f5c2c7",
        color: "#842029",
        padding: "1rem",
        marginTop: "0.5rem",
        borderRadius: "5px",
        fontSize: "0.95rem",
      }}
    >
      {tramiteSeleccionado.comentario_revisor}
    </div>
  ) : (
    <textarea
      id="comentario"
      rows={4}
      value={comentario}
      onChange={(e) => setComentario(e.target.value)}
      placeholder="Escribe un comentario si vas a rechazar el trámite..."
      style={{
        marginTop: "0.5rem",
        width: "100%",
        padding: "0.75rem",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "0.95rem",
      }}
    />
  )}
</div>


              <div className="botones-modal">
                <button
                  className="btn-pdf"
                  onClick={() => {
                    const index = tramites.findIndex(t => t.id === tramiteSeleccionado.id);
                    generatePDF(tramiteSeleccionado, index + 1);
                  }}
                >
                  Descargar PDF
                </button>
                <button className="btn-cerrar" onClick={() => {
                  setComentario("");
                  setTramiteSeleccionado(null);
                }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RevisorDashboard;
