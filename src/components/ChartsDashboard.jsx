import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ChartsDashboard = ({ pendientes, aprobados, rechazados }) => {
  const barData = {
    labels: ['Pendientes', 'Aprobados', 'Rechazados'],
    datasets: [
      {
        label: 'Cantidad de Trámites',
        data: [pendientes, aprobados, rechazados],
        backgroundColor: ['#FFC107', '#28A745', '#DC3545'],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ['Pendientes', 'Aprobados', 'Rechazados'],
    datasets: [
      {
        data: [pendientes, aprobados, rechazados],
        backgroundColor: ['#FFC107', '#28A745', '#DC3545'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="charts-dashboard">
      <div className="chart-box">
        <h3>Trámites por Estado (Barras)</h3>
        <Bar data={barData} options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true }
          }
        }} />
      </div>
      <div className="chart-box">
        <h3>Trámites por Estado (Pastel)</h3>
        <Pie data={pieData} options={{
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }} />
      </div>
    </div>
  );
};

export default ChartsDashboard;