// src/views/AdminDashboard/TramitesTable.jsx
import ReactPaginate from "react-paginate";
import { generatePDF } from "../../utils/pdfUtils";

const formatearFecha = (fechaIso) => {
  const fecha = new Date(fechaIso);
  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, "0");
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${año} ${horas}:${minutos}`;
};

const TramitesTable = ({ tramites, displayTramites, handlePageChange, itemsPerPage }) => {
  const handleDescargarPDF = (tramite) => {
    const tramiteConFechas = {
      ...tramite,
      tipo: tramite.tipo,
      estado: tramite.estado,
      createdAt: tramite.createdAt || new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
    };
    generatePDF(tramiteConFechas);
  };

  return (
    <div className="tabla-container">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>ID</th>
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
          {displayTramites.length > 0 ? (
            displayTramites.map((tramite) => (
              <tr key={tramite.id}>
                <td style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#888" }}>
                  {tramite.id}
                </td>
                <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  {tramite.folio || "Sin folio"}
                </td>
                <td>{tramite.tipo}</td>
                <td>{tramite.solicitante || "No especificado"}</td>
                <td className={`estado ${tramite.estado?.toLowerCase() || ""}`}>
                  <strong>{tramite.estado || "Desconocido"}</strong>
                  {tramite.estado === "Rechazado" && tramite.comentario_revisor && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#c00",
                        marginTop: "4px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      Motivo de Rechazo: {tramite.comentario_revisor}
                    </div>
                  )}
                </td>
                <td>{tramite.createdAt ? formatearFecha(tramite.createdAt) : "Sin fecha"}</td>
                <td>{tramite.reviewedAt ? formatearFecha(tramite.reviewedAt) : "-"}</td>
                <td>
                  {tramite.estado === "Aprobado" && (
                    <button
                      className="btn-descargar"
                      onClick={() => handleDescargarPDF(tramite)}
                    >
                      Descargar
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "#888" }}>
                No se encontraron trámites.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"← Anterior"}
        nextLabel={"Siguiente →"}
        pageCount={Math.ceil(tramites.length / itemsPerPage)}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active-page"}
        disabledClassName={"disabled-page"}
      />
    </div>
  );
};

export default TramitesTable;
