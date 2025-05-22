// src/views/RevisorDashboard.jsx
import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import { generatePDF } from "../utils/pdfUtils";
import { sendTramiteEmail } from "../services/emailService";
import "./RevisorDashboard.css";

const RevisorDashboard = () => {
  const { tramites, updateTramiteEstado, setNombreUsuario, setRolUsuario } = useTramites();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);

  const handleAprobar = async (id) => {
    updateTramiteEstado(id, "Aprobado");

    const tramite = tramites.find(t => t.id === id);
    if (tramite) {
      await sendTramiteEmail({ ...tramite, estado: "Aprobado" });
    }
  };

  const handleRechazar = async (id) => {
    updateTramiteEstado(id, "Rechazado");

    const tramite = tramites.find(t => t.id === id);
    if (tramite) {
      await sendTramiteEmail({ ...tramite, estado: "Rechazado" });
    }
  };

  const handleCerrarSesion = () => {
    setNombreUsuario("");
    setRolUsuario("");
  };

  const handleVerDetalles = (tramite) => {
    setTramiteSeleccionado(tramite);
  };

  return (
    <>
      <Navbar />
      <div className="revisor-container">
        <h2>Revisión de Trámites</h2>

        {tramites.length === 0 ? (
          <div className="no-tramites">No hay trámites pendientes 🚀</div>
        ) : (
          <table className="tabla-revisor">
            <thead>
              <tr>
                <th>Tipo de Trámite</th>
                <th>Solicitante</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map((tramite) => (
                <tr key={tramite.id}>
                  <td>{tramite.tipo}</td>
                  <td>{tramite.solicitante || "No especificado"}</td>
                  <td className={`estado ${tramite.estado.toLowerCase()}`}>{tramite.estado}</td>
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
        {/* Modal Detalle */}
{tramiteSeleccionado && (
  <div className="modal-overlay" onClick={(e) => {
    if (e.target.classList.contains('modal-overlay'))
      setTramiteSeleccionado(null);
  }}>
    <div className="modal-content">
      <h2>Municipalidad de Ejemplo</h2>
      <p className="subtitulo">Documento Validado de Trámite</p>
      <hr />

      <h3>Datos del Trámite</h3>
      <table className="tabla-detalle">
        <tbody>
          <tr><th>Tipo de Trámite</th><td>{tramiteSeleccionado.tipo}</td></tr>
          <tr><th>Fecha de Solicitud</th><td>{new Date(tramiteSeleccionado.createdAt).toLocaleDateString()}</td></tr>
          <tr><th>Fecha de Validación</th><td>{tramiteSeleccionado.reviewedAt ? new Date(tramiteSeleccionado.reviewedAt).toLocaleDateString() : "-"}</td></tr>
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

      <div className="botones-modal">
        <button className="btn-pdf" onClick={() => generatePDF(tramiteSeleccionado)}>Descargar PDF</button>
        <button className="btn-cerrar" onClick={() => setTramiteSeleccionado(null)}>Cerrar</button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default RevisorDashboard;