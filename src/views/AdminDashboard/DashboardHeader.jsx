import PropTypes from "prop-types";

const DashboardHeader = ({ onExportDashboard }) => {
  return (
    <>
      <h2>Panel de Administración</h2>
      <div className="exportar-container">
        <button className="btn-exportar" onClick={onExportDashboard}>
          📥 Exportar Dashboard
        </button>
      </div>
    </>
  );
};

DashboardHeader.propTypes = {
  onExportDashboard: PropTypes.func.isRequired,
};

export default DashboardHeader;