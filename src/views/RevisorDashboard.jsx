// src/components/RevisorDashboard.jsx
import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import { generatePDF } from "../utils/pdfUtils";
import { sendTramiteEmail } from "../services/emailService";
import "./RevisorDashboard.css";

const formatearFecha = (fechaIso) => {
  if (!fechaIso) return "-";
  const fecha = new Date(fechaIso);
  const opciones = {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const partes = new Intl.DateTimeFormat("es-MX", opciones).formatToParts(fecha);
  const getPart = (type) => partes.find(p => p.type === type)?.value.padStart(2, '0');
  const dia = getPart("day");
  const mes = getPart("month");
  const año = getPart("year");
  const hora = getPart("hour");
  const minuto = getPart("minute");
  return `${dia}/${mes}/${año} ${hora}:${minuto}`;
};

const obtenerFechaCDMX = () => {
  const fecha = new Date();
  const opciones = {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const partes = new Intl.DateTimeFormat("es-MX", opciones).formatToParts(fecha);
  const getPart = (type) => partes.find(p => p.type === type)?.value.padStart(2, '0');
  const año = getPart("year");
  const mes = getPart("month");
  const dia = getPart("day");
  const hora = getPart("hour");
  const minuto = getPart("minute");
  return `${año}-${mes}-${dia}T${hora}:${minuto}:00`;
};

const RevisorDashboard = () => {
  const { tramites, updateTramiteEstado } = useTramites();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  const [comentario, setComentario] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [orden, setOrden] = useState("recientes");

  const handleAprobar = async (id) => {
    const tramite = tramites.find(t => t.id === id);
    if (tramite?.estado === "Aprobado") {
      alert("Este trámite ya fue aprobado.");
      return;
    }

    const confirmar = window.confirm("¿Estás seguro de que deseas aprobar este trámite?");
    if (!confirmar) return;

    const reviewedAt = obtenerFechaCDMX();
    updateTramiteEstado(id, "Aprobado", undefined, reviewedAt);
    if (tramite) await sendTramiteEmail({ ...tramite, estado: "Aprobado" });
    setTramiteSeleccionado(null);
    setComentario("");
  };

  const handleRechazar = async (id) => {
    const tramite = tramites.find(t => t.id === id);

    if (!tramiteSeleccionado || tramiteSeleccionado.id !== id) {
      setTramiteSeleccionado(tramite);
      return;
    }

    if (tramite?.estado === "Rechazado") {
      const yaComentado = tramite.comentario_revisor?.trim();
      alert(`Este trámite ya fue rechazado.\n\nComentario: ${yaComentado || "(sin comentario)"}`);
      return;
    }

    if (tramite?.estado === "Aprobado") {
      const confirmar = window.confirm("Este trámite ya fue aprobado. ¿Estás seguro de que deseas rechazarlo?");
      if (!confirmar) return;
    }

    if (!comentario.trim()) {
      setComentario("");
      const textArea = document.getElementById("comentario");
      if (textArea) {
        textArea.focus();
        textArea.classList.add("resaltar-error");
        setTimeout(() => textArea.classList.remove("resaltar-error"), 1500);
      }
      return;
    }

    const reviewedAt = obtenerFechaCDMX();
    updateTramiteEstado(id, "Rechazado", comentario, reviewedAt);
    if (tramite) await sendTramiteEmail({ ...tramite, estado: "Rechazado", comentarioRevisor: comentario });
    setComentario("");
    setTramiteSeleccionado(null);
  };

  const tramitesFiltrados = tramiteSeleccionado
    ? [tramiteSeleccionado]
    : tramites
      .filter((t) => {
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

        <table className="tabla-revisor">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Tipo</th>
              <th>Solicitante</th>
              <th>Estado</th>
              <th>Fecha de Solicitud</th>
              <th>Fecha de Revisión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tramitesFiltrados.map((tramite) => (
              <tr key={tramite.id} className="fila-tramite">
                <td>{tramite.folio}</td>
                <td>{tramite.tipo}</td>
                <td>{tramite.solicitante}</td>
                <td className={`estado ${tramite.estado.toLowerCase()}`}>
                  <div>{tramite.estado}</div>
                  {tramite.estado === "Rechazado" && tramite.comentario_revisor && (
                    <div style={{ fontSize: "0.85rem", marginTop: "4px", color: "#c53030" }}>
                      <strong>Motivo:</strong> {tramite.comentario_revisor}
                    </div>
                  )}
                </td>
                <td>{formatearFecha(tramite.createdAt)}</td>
                <td>{formatearFecha(tramite.reviewedAt)}</td>
                <td className="acciones">
                  <button className="btn btn-ver" onClick={() => setTramiteSeleccionado(tramite)}>🔎 Ver Detalle</button>
                  <button className="btn btn-aprobar" onClick={() => handleAprobar(tramite.id)}>✔ Aprobar</button>
                  <button className="btn btn-rechazar" onClick={() => handleRechazar(tramite.id)}>✘ Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tramiteSeleccionado && (
          <div className="modal-detalle">
            <div className="modal-content">
              <h3>Detalles del Trámite</h3>
              <p><strong>Folio:</strong> {tramiteSeleccionado.folio}</p>
              <p><strong>Tipo:</strong> {tramiteSeleccionado.tipo}</p>
              <p><strong>Solicitante:</strong> {tramiteSeleccionado.solicitante}</p>
              <p><strong>Estado:</strong> {tramiteSeleccionado.estado}</p>
              <p><strong>Fecha Solicitud:</strong> {formatearFecha(tramiteSeleccionado.createdAt)}</p>
              <p><strong>Fecha Revisión:</strong> {formatearFecha(tramiteSeleccionado.reviewedAt)}</p>

              {tramiteSeleccionado.estado === "Rechazado" && tramiteSeleccionado.comentario_revisor && (
                <div className="comentario-rechazo">{tramiteSeleccionado.comentario_revisor}</div>
              )}

              {tramiteSeleccionado.estado !== "Rechazado" && (
                <div className="comentario-revisor">
                  <label htmlFor="comentario">Motivo de Rechazo:</label>
                  <textarea
                    id="comentario"
                    rows={3}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe el motivo para rechazar..."
                  />
                </div>
              )}

              <div className="acciones-modal">
                <button className="btn btn-pdf" onClick={() => generatePDF(tramiteSeleccionado)}>📄 Descargar PDF</button>
                <button onClick={() => setTramiteSeleccionado(null)} className="btn btn-cerrar">✖ Cerrar Detalle</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RevisorDashboard;
