import React from "react";
import ReactPaginate from "react-paginate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./TramitesTable.css";

const TramitesTable = ({
  tramites = [],
  displayTramites = [],
  handlePageChange,
  itemsPerPage = 10,
  currentPage = 0,
}) => {
  const pageCount = Math.ceil(tramites.length / itemsPerPage);

  const exportarPDF = (tramite) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Resumen del Trámite", 14, 22);

    const fields = Object.entries(tramite.campos || {}).map(([key, value]) => [
      key,
      typeof value === "boolean" ? (value ? "Sí" : "No") : value,
    ]);

    autoTable(doc, {
      head: [["Campo", "Valor"]],
      body: fields,
      startY: 30,
    });

    doc.save(`tramite_${tramite.folio || tramite.id}.pdf`);
  };

  return (
    <div className="tabla-container">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>FOLIO</th>
            <th>TIPO</th>
            <th>ÁREA</th>
            <th>SOLICITANTE</th>
            <th>ESTADO</th>
            <th>FECHA SOLICITUD</th>
            <th>FECHA REVISIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {displayTramites.length === 0 ? (
            <tr>
              <td colSpan="8">No hay resultados</td>
            </tr>
          ) : (
            displayTramites.map((tramite) => (
              <tr key={tramite.id}>
                <td>{tramite.folio || tramite.id}</td>
                <td>{tramite.tipo_tramite_nombre || "Sin tipo"}</td>
                <td>{tramite.area_nombre || "Sin área"}</td>
                <td>{tramite.solicitante || "Sin solicitante"}</td>
                <td className={`estado ${tramite.estado?.toLowerCase()}`}>
                  {tramite.estado}
                  {tramite.estado === "Rechazado" &&
                    tramite.comentario_revisor && (
                      <div className="comentario-rechazo">
                        Motivo: {tramite.comentario_revisor}
                      </div>
                    )}
                </td>
                <td>
                  {tramite.createdAt
                    ? new Date(tramite.createdAt).toLocaleString()
                    : "Sin fecha"}
                </td>
                <td>
                  {tramite.reviewedAt
                    ? new Date(tramite.reviewedAt).toLocaleString()
                    : tramite.estado === "Pendiente"
                    ? "-"
                    : "Sin fecha"}
                </td>
                <td>
                  {tramite.estado === "Aprobado" && (
                    <button
                      className="btn-descargar"
                      onClick={() => exportarPDF(tramite)}
                    >
                      Descargar 📄
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pageCount > 1 && (
        <div className="paginacion-container">
          <ReactPaginate
            previousLabel={<span className="page-link">&laquo;</span>}
            nextLabel={<span className="page-link">&raquo;</span>}
            breakLabel={<span className="page-link">…</span>}
            onPageChange={handlePageChange}
            pageCount={pageCount}
            forcePage={currentPage} // 👈 esto asegura que se resalte la página correcta
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            containerClassName="pagination pagination-centered"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            nextClassName="page-item"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active-page" // se refleja en el CSS
            disabledClassName="disabled-page"
          />
        </div>
      )}
    </div>
  );
};

export default TramitesTable;
