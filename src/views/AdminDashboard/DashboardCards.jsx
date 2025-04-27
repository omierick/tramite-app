import PropTypes from "prop-types";

const DashboardCards = ({ total, pendientes, aprobados, rechazados, promedioTiempo, tramitesHoy }) => {
  return (
    <div className="dashboard-grid">
      <div className="card-dashboard"><h3>Total Trámites</h3><p>{total}</p></div>
      <div className="card-dashboard"><h3>Pendientes</h3><p>{pendientes}</p></div>
      <div className="card-dashboard"><h3>Aprobados</h3><p>{aprobados}</p></div>
      <div className="card-dashboard"><h3>Rechazados</h3><p>{rechazados}</p></div>
      <div className="card-dashboard"><h3>Tiempo Promedio Resolución</h3><p>{promedioTiempo}</p></div>
      <div className="card-dashboard"><h3>Trámites Hoy</h3><p>{tramitesHoy}</p></div>
    </div>
  );
};

DashboardCards.propTypes = {
  total: PropTypes.number.isRequired,
  pendientes: PropTypes.number.isRequired,
  aprobados: PropTypes.number.isRequired,
  rechazados: PropTypes.number.isRequired,
  promedioTiempo: PropTypes.string.isRequired,
  tramitesHoy: PropTypes.number.isRequired,
};

export default DashboardCards;