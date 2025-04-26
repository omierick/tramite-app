import html2pdf from "html2pdf.js";
import "./TramitePreview.css";

const TramitePreview = ({ tramite, onClose }) => {
  if (!tramite) return null;

  const handleDescargarPDF = () => {
    const element = document.getElementById('tramite-preview-pdf');
    html2pdf().from(element).set({
      margin: 1,
      filename: `Tramite_${tramite.tipo}_${new Date().toISOString().slice(0,10)}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    }).save();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" id="tramite-preview-pdf">
        {/* CABECERA */}
        <div className="pdf-header">
          <img src="/logo.png" alt="Logo" className="logo-pdf" />
          <h1>Municipalidad de Ejemplo</h1>
          <p className="fecha-pdf">Fecha: {new Date().toLocaleDateString()}</p>
          <hr />
        </div>

        {/* CONTENIDO DEL TRÁMITE */}
        <h2>Vista Previa del Trámite</h2>
        <p><strong>Tipo de Trámite:</strong> {tramite.tipo}</p>
        <p><strong>Estado:</strong> {tramite.estado}</p>

        <h3>Datos del Solicitante:</h3>
        <div className="campos-container">
          {Object.entries(tramite.campos).map(([campo, valor], idx) => (
            <p key={idx}><strong>{campo}:</strong> {valor}</p>
          ))}
        </div>
      </div>

      <div className="modal-actions">
        <button className="btn-descargar" onClick={handleDescargarPDF}>
          Descargar PDF
        </button>
        <button className="btn-cerrar" onClick={onClose}>
          Cerrar Vista Previa
        </button>
      </div>
    </div>
  );
};

export default TramitePreview;