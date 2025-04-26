import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import TramitePreview from "../components/TramitePreview";
import "./RevisorDashboard.css";

const RevisorDashboard = () => {
  const { tramites, updateTramiteEstado } = useTramites();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);

  const handleAprobar = (index) => {
    updateTramiteEstado(index, "Aprobado");
  };

  const handleRechazar = (index) => {
    updateTramiteEstado(index, "Rechazado");
  };

  const handleVerDetalles = (tramite) => {
    setTramiteSeleccionado(tramite);
  };

  const cerrarPreview = () => {
    setTramiteSeleccionado(null);
  };

  const getNombreSolicitante = (campos) => {
    return campos["Nombre del solicitante"] || "No especificado";
  };

  const calcularTiempo = (createdAt, reviewedAt) => {
    if (!reviewedAt) return "-"; // No ha sido revisado todavía
    const start = new Date(createdAt);
    const end = new Date(reviewedAt);
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  return (
    <>
      <Navbar />
      <div className="revisor-container">
        <h2>Revisión de Trámites</h2>

        {tramites.length === 0 ? (
          <p>No hay trámites enviados aún.</p>
        ) : (
          <table className="tabla-revisor">
            <thead>
              <tr>
                <th>Tipo de Trámite</th>
                <th>Solicitante</th>
                <th>Estado</th>
                <th>Tiempo Resolución</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map((tramite, idx) => (
                <tr key={idx}>
                  <td>{tramite.tipo}</td>
                  <td>{getNombreSolicitante(tramite.campos)}</td>
                  <td className={`estado ${tramite.estado.toLowerCase()}`}>
                    {tramite.estado === "Pendiente" && "⏳ Pendiente"}
                    {tramite.estado === "Aprobado" && "✅ Aprobado"}
                    {tramite.estado === "Rechazado" && "❌ Rechazado"}
                  </td>
                  <td>
                    {tramite.createdAt && tramite.reviewedAt
                      ? calcularTiempo(tramite.createdAt, tramite.reviewedAt)
                      : "-"}
                  </td>
                  <td>
                    <div className="acciones">
                      <button className="btn-ver" onClick={() => handleVerDetalles(tramite)}>
                        Ver Detalles
                      </button>
                      {tramite.estado === "Pendiente" && (
                        <>
                          <button className="btn-aprobar" onClick={() => handleAprobar(idx)}>Aprobar</button>
                          <button className="btn-rechazar" onClick={() => handleRechazar(idx)}>Rechazar</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tramiteSeleccionado && (
          <TramitePreview tramite={tramiteSeleccionado} onClose={cerrarPreview} />
        )}
      </div>
    </>
  );
};

export default RevisorDashboard;