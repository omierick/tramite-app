import { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, format, startOfMonth, endOfMonth } from 'date-fns';

const HeatmapDashboard = ({ tramites }) => {
  const today = new Date();

  // Estados para filtros
  const [startDate, setStartDate] = useState(startOfMonth(subDays(today, 90)));
  const [endDate, setEndDate] = useState(endOfMonth(today));
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

  if (!tramites || tramites.length === 0) {
    return (
      <div className="heatmap-container">
        <h3>Mapa de Calor de Creación de Trámites</h3>
        <p style={{ textAlign: 'center', color: '#999' }}>No hay datos suficientes para mostrar el mapa.</p>
      </div>
    );
  }

  // Extraer tipos únicos de trámite
  const tiposTramiteUnicos = Array.from(new Set(tramites.map(t => t.tipo)));

  const handleStartChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

  const handleEndChange = (e) => {
    setEndDate(new Date(e.target.value));
  };

  const handleTipoChange = (e) => {
    setTipoFiltro(e.target.value);
  };

  // Filtrar trámites según fecha y tipo seleccionado
  const valoresFiltrados = tramites
    .filter(t => {
      const createdAt = new Date(t.createdAt);
      const dentroDeFechas = createdAt >= startDate && createdAt <= endDate;
      const coincideTipo = tipoFiltro === 'Todos' || t.tipo === tipoFiltro;
      return dentroDeFechas && coincideTipo;
    })
    .map(t => ({
      date: t.createdAt.split('T')[0],
      count: 1,
    }));

  return (
    <div className="heatmap-container">
      <h3>Mapa de Calor de Creación de Trámites</h3>

      <div className="filter-dates">
        <div>
          <label>Desde:</label>
          <input
            type="month"
            value={format(startDate, 'yyyy-MM')}
            onChange={handleStartChange}
          />
        </div>

        <div>
          <label>Hasta:</label>
          <input
            type="month"
            value={format(endDate, 'yyyy-MM')}
            onChange={handleEndChange}
          />
        </div>

        <div>
          <label>Tipo:</label>
          <select value={tipoFiltro} onChange={handleTipoChange}>
            <option value="Todos">Todos</option>
            {tiposTramiteUnicos.map((tipo, idx) => (
              <option key={idx} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={valoresFiltrados}
        classForValue={(value) => {
          if (!value || value.count === 0) {
            return 'color-empty';
          }
          if (value.count >= 5) return 'color-scale-4';
          if (value.count >= 3) return 'color-scale-3';
          if (value.count >= 2) return 'color-scale-2';
          return 'color-scale-1';
        }}
        tooltipDataAttrs={(value) => ({
          'data-tip': `${value.date}: ${value.count || 0} trámite(s)`,
        })}
        showWeekdayLabels
      />
    </div>
  );
};

export default HeatmapDashboard;