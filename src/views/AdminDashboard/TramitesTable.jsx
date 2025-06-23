// src/views/AdminDashboard/TramitesTable.jsx
import ReactPaginate from "react-paginate";
import { generatePDF } from "../../utils/pdfUtils";

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
            <th>Fecha de Creación</th>
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
                  {tramite.estado || "Desconocido"}
                  {(tramite.estado === "Aprobado" || tramite.estado === "Rechazado") && tramite.reviewedAt && (
                    <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>
                      {new Date(tramite.reviewedAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </td>
                <td>
                  {tramite.createdAt
                    ? new Date(tramite.createdAt).toLocaleString()
                    : "Sin fecha"}
                </td>
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
              <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
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
