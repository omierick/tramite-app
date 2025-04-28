// src/views/AdminDashboard/TramitesTable.jsx
import ReactPaginate from "react-paginate";

const TramitesTable = ({ tramites, displayTramites, handlePageChange, itemsPerPage }) => {
  return (
    <div className="tabla-container">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>Tipo de Trámite</th>
            <th>Solicitante</th>
            <th>Estado</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {displayTramites.length > 0 ? (
            displayTramites.map((tramite) => (
              <tr key={tramite.id}>
                <td>{tramite.tipo}</td>
                <td>{tramite.solicitante || "No especificado"}</td>
                <td className={`estado ${tramite.estado?.toLowerCase() || ""}`}>
                  {tramite.estado || "Desconocido"}
                </td>
                <td>
                  {tramite.createdAt
                    ? new Date(tramite.createdAt).toLocaleString()
                    : "Sin fecha"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron trámites.</td>
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