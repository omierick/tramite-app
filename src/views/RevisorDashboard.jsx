import { useState, useRef } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import { generatePDF } from "../utils/pdfUtils";
import { sendTramiteEmail } from "../services/emailService";
import "./RevisorDashboard.css";

const formatearFecha = (fechaIso) => {
  if (!fechaIso) return "-";
  const fecha = new Date(fechaIso);
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${año} - ${horas}:${minutos}`;
};

const RevisorDashboard = () => {
  const { tramites, updateTramiteEstado, setNombreUsuario, setRolUsuario } = useTramites();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  const [comentario, setComentario] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [orden, setOrden] = useState("recientes");
  const [mostrarSoloSeleccionado, setMostrarSoloSeleccionado] = useState(false);
  const textareaRef = useRef(null);

  const handleAprobar = async (id) => {
    updateTramiteEstado(id, "Aprobado");
    const tramite = tramites.find(t => t.id === id);
    if (tramite) {
      await sendTramiteEmail({ ...tramite, estado: "Aprobado" });
    }
    setTramiteSeleccionado(null);
    setComentario("");
    setMostrarSoloSeleccionado(false);
  };

  const handleRechazar = async (id) => {
    const tramite = tramites.find(t => t.id === id);

    if (!tramiteSeleccionado || tramiteSeleccionado.id !== id) {
      setComentario("");
      setTramiteSeleccionado(tramite);
      setMostrarSoloSeleccionado(true);
      return;
    }

    if (tramite.estado === "Rechazado") {
      const yaTieneComentario = tramite.comentario_revisor?.trim();
      alert(`Este trámite ya fue rechazado.${yaTieneComentario ? `\nComentario previo: ${tramite.comentario_revisor}` : "\nNo hay comentario registrado."}`);
      return;
    }

    if (tramite.estado === "Aprobado") {
      const confirmar = confirm("Este trámite ya fue aprobado. ¿Deseas rechazarlo de todos modos?");
      if (!confirmar) return;
    }

    if (!comentario.trim()) {
      if (textareaRef.current) {
        textareaRef.current.classList.add("input-error");
        textareaRef.current.focus();
        textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => textareaRef.current.classList.remove("input-error"), 1000);
      }
      return;
    }

    updateTramiteEstado(id, "Rechazado", comentario);
    if (tramite) {
      await sendTramiteEmail({ ...tramite, estado: "Rechazado", comentarioRevisor: comentario });
    }
    setComentario("");
    setTramiteSeleccionado(null);
    setMostrarSoloSeleccionado(false);
  };

  const handleVerDetalles = (tramite) => {
    setComentario("");
    setTramiteSeleccionado(tramite);
    setMostrarSoloSeleccionado(true);
  };

  const tramitesFiltrados = tramites
    .filter((t) => {
      if (mostrarSoloSeleccionado && tramiteSeleccionado) return t.id === tramiteSeleccionado.id;
      if (filtroEstado !== "todos" && t.estado !== filtroEstado) return false;
      return (
        (t.folio ?? "").toString().toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.tipo ?? "").toString().toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.solicitante ?? "").toString().toLowerCase().includes(busqueda.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (orden === "recientes") return new Date(b.createdAt) - new Date(a.createdAt);
      if (orden === "antiguos") return new Date(a.createdAt) - new Date(b.createdAt);
      if (orden === "tipo") return (a.tipo ?? "").localeCompare(b.tipo ?? "");
      return 0;
    });

  return (
    <>
      <Navbar />
      <div className="revisor-container">
        <h2>Revisión de Trámites</h2>

        <div className="filtros-container">
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="filtro-select">
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

          <select value={orden} onChange={(e) => setOrden(e.target.value)} className="filtro-select">
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
                  <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{tramite.folio || "Sin folio"}</td>
                  <td>{tramite.tipo}</td>
                  <td>{tramite.solicitante || "No especificado"}</td>
                  <td className={`estado ${tramite.estado.toLowerCase()}`}>{tramite.estado}</td>
                  <td>{formatearFecha(tramite.createdAt)}</td>
                  <td>{formatearFecha(tramite.reviewedAt)}</td>
                  <td className="acciones">
                    <button className="btn-detalles" onClick={() => handleVerDetalles(tramite)}>Ver Detalles</button>
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
              setComentario("");
              setTramiteSeleccionado(null);
              setMostrarSoloSeleccionado(false);
            }
          }}>
            <div className="modal-content">
              <h2>Municipalidad de Ejemplo</h2>
              <p className="subtitulo">Documento Validado de Trámite</p>
              <hr />
              <h3>Datos del Trámite</h3>
              <table className="tabla-detalle">
                <tbody>
                  <tr><th>Folio</th><td>{tramiteSeleccionado.folio || "Sin folio"}</td></tr>
                  <tr><th>Tipo de Trámite</th><td>{tramiteSeleccionado.tipo}</td></tr>
                  <tr><th>Fecha de Solicitud</th><td>{formatearFecha(tramiteSeleccionado.createdAt)}</td></tr>
                  <tr>
                    <th>{tramiteSeleccionado.estado === "Aprobado" ? "Fecha de Aprobación" : tramiteSeleccionado.estado === "Rechazado" ? "Fecha de Rechazo" : "Fecha de Validación"}</th>
                    <td>{formatearFecha(tramiteSeleccionado.reviewedAt)}</td>
                  </tr>
                  <tr><th>Estado</th><td>{tramiteSeleccionado.estado}</td></tr>
                </tbody>
              </table>

              <h3>Datos del Solicitante</h3>
              <table className="tabla-detalle">
                <tbody>
                  <tr><th>Nombre Completo</th><td>{tramiteSeleccionado.solicitante || "-"}</td></tr>
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
                <label htmlFor="comentario">Comentario del Revisor (obligatorio para rechazar):</label>
                {tramiteSeleccionado.estado === "Rechazado" && tramiteSeleccionado.comentario_revisor ? (
                  <div className="comentario-rechazo">{tramiteSeleccionado.comentario_revisor}</div>
                ) : (
                  <textarea
                    id="comentario"
                    ref={textareaRef}
                    rows={4}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe un comentario si vas a rechazar el trámite..."
                  />
                )}
              </div>

              <div className="botones-modal">
                <button className="btn-pdf" onClick={() => generatePDF(tramiteSeleccionado)}>Descargar PDF</button>
                <button className="btn-cerrar" onClick={() => {
                  setComentario("");
                  setTramiteSeleccionado(null);
                  setMostrarSoloSeleccionado(false);
                }}>✖ Cerrar Detalle</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RevisorDashboard;
