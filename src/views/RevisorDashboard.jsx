import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "./RevisorDashboard.css";

const RevisorDashboard = () => {
  const { tramites, updateTramiteEstado, setNombreUsuario, setRolUsuario } = useTramites();
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);

  const handleAprobar = (id) => {
    updateTramiteEstado(id, "Aprobado");
  };

  const handleRechazar = (id) => {
    updateTramiteEstado(id, "Rechazado");
  };

  const handleCerrarSesion = () => {
    setNombreUsuario("");
    setRolUsuario("");
  };

  const handleVerDetalles = (tramite) => {
    setTramiteSeleccionado(tramite);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay-modal")) {
      setTramiteSeleccionado(null);
    }
  };

  const handleDescargarPDF = (tramite) => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Detalle del Trámite", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Tipo: ${tramite.tipo}`, 20, 40);
    pdf.text(`Solicitante: ${tramite.solicitante || "No especificado"}`, 20, 55);
    pdf.text(`Estado: ${tramite.estado}`, 20, 70);

    let y = 90;
    for (const [campo, valor] of Object.entries(tramite.campos)) {
      pdf.text(`${campo}: ${valor}`, 20, y);
      y += 10;
    }

    if (tramite.firma) {
      const imgProps = pdf.getImageProperties(tramite.firma);
      const pdfWidth = 80;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(tramite.firma, "PNG", 20, y + 10, pdfWidth, pdfHeight);
    }

    pdf.setFontSize(10);
    pdf.text(`Fecha de descarga: ${new Date().toLocaleString()}`, 20, 280);

    pdf.save(`tramite_${tramite.id}.pdf`);
  };

  return (
    <>
      <Navbar />
      <div className="revisor-container">
        <h2>Revisión de Trámites</h2>

        {tramites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>No hay trámites pendientes para revisar 🚀</p>
          </div>
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
                  <td className={`estado ${tramite.estado.toLowerCase()}`}>
                    {tramite.estado}
                  </td>
                  <td className="acciones">
                    <button className="btn-detalles" onClick={() => handleVerDetalles(tramite)}>
                      Ver Detalles
                    </button>
                    <button className="btn-aprobar" onClick={() => handleAprobar(tramite.id)}>
                      Aprobar
                    </button>
                    <button className="btn-rechazar" onClick={() => handleRechazar(tramite.id)}>
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal de Detalles */}
        {tramiteSeleccionado && (
          <div className="overlay-modal" onClick={handleOverlayClick}>
            <div className="detalle-modal">
              <h3>Detalles del Trámite</h3>
              <p><strong>Tipo:</strong> {tramiteSeleccionado.tipo}</p>
              <p><strong>Solicitante:</strong> {tramiteSeleccionado.solicitante}</p>
              <p><strong>Estado:</strong> {tramiteSeleccionado.estado}</p>

              {Object.entries(tramiteSeleccionado.campos).map(([campo, valor], idx) => (
                <p key={idx}><strong>{campo}:</strong> {valor}</p>
              ))}

              {tramiteSeleccionado.firma && tramiteSeleccionado.firma.startsWith("data:image/") ? (
                <div className="firma-preview-container" style={{ marginTop: "20px", textAlign: "center" }}>
                  <h4 style={{ marginBottom: "10px" }}>Firma del Solicitante:</h4>
                  <div
                    style={{
                      display: "inline-block",
                      border: "1px dashed #ccc",
                      padding: "10px",
                      borderRadius: "8px",
                      maxWidth: "300px",
                    }}
                  >
                    <img
                      src={tramiteSeleccionado.firma}
                      alt="Firma del solicitante"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p><em>Sin firma disponible</em></p>
              )}

              <div className="botones-modal">
                <button className="btn-pdf" onClick={() => handleDescargarPDF(tramiteSeleccionado)}>
                  Descargar PDF
                </button>
                <button className="btn-cerrar" onClick={() => setTramiteSeleccionado(null)}>
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