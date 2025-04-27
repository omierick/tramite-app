import { lazy, Suspense } from "react";
import PropTypes from "prop-types";

const ChartsDashboard = lazy(() => import("../../components/ChartsDashboard"));
const HeatmapDashboard = lazy(() => import("../../components/HeatmapDashboard"));

const DashboardCharts = ({ pendientes, aprobados, rechazados, tramites }) => {
  return (
    <div className="visual-dashboard">
      <Suspense fallback={<div>Cargando gráficos...</div>}>
        <ChartsDashboard
          pendientes={pendientes}
          aprobados={aprobados}
          rechazados={rechazados}
        />
        <HeatmapDashboard tramites={tramites} />
      </Suspense>
    </div>
  );
};

DashboardCharts.propTypes = {
  pendientes: PropTypes.number.isRequired,
  aprobados: PropTypes.number.isRequired,
  rechazados: PropTypes.number.isRequired,
  tramites: PropTypes.array.isRequired,
};

export default DashboardCharts;