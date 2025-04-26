import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import { generatePDF } from "../utils/pdfUtils"; // 👈 para descargar PDF
import "./RevisorDashboard.css";

const RevisorDashboard = () => {
  const { tramites, updateTramiteEstado } = useTramites();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);

  const handleAprobar = (id) => {
    updateTramiteEstado(id, "Aprobado");
  };

  const handleRechazar = (id) => {
    updateTramiteEstado(id, "Rechazado");
  };

  const handleVerDetalles = (tramite) => {
    setTramiteSeleccionado(tramite);
  };

  const handleCerrarModal = () => {
    setTramiteSeleccionado(null);
  };

  const handleDescargarPDF = (tramite) => {
    generatePDF(tramite);
  };

  return (
    <>
      <Navbar />
      <div className="revisor-container">
        <h2>Revisión de Trámites</h2>
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
                <td>{tramite.campos["Nombre del solicitante"] || "No especificado"}</td>
                <td className={`estado ${tramite.estado.toLowerCase()}`}>{tramite.estado}</td>
                <td className="acciones">
                  <button className="btn-ver" onClick={() => handleVerDetalles(tramite)}>Ver</button>
                  <button className="btn-aprobar" onClick={() => handleAprobar(tramite.id)}>Aprobar</button>
                  <button className="btn-rechazar" onClick={() => handleRechazar(tramite.id)}>Rechazar</button>
                  <button className="btn-pdf" onClick={() => handleDescargarPDF(tramite)}>Descargar PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tramiteSeleccionado && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Detalles del Trámite</h3>
              {Object.entries(tramiteSeleccionado.campos).map(([campo, valor], idx) => (
                <p key={idx}><strong>{campo}:</strong> {valor}</p>
              ))}

              {tramiteSeleccionado.firma && (
                <>
                  <h4>Firma del Solicitante:</h4>
                  <img
                    src={tramiteSeleccionado.firma}
                    alt="Firma"
                    style={{ width: "100%", border: "1px solid #ccc", marginTop: "10px", borderRadius: "8px" }}
                  />
                </>
              )}

              <button className="btn-cerrar" onClick={handleCerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RevisorDashboard;