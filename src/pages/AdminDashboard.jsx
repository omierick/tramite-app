import { useState, useRef } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import ChartsDashboard from "../components/ChartsDashboard";
import HeatmapDashboard from "../components/HeatmapDashboard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { tiposTramite, tramites, addTipoTramite } = useTramites();
  const [nombreTramite, setNombreTramite] = useState("");
  const [campoNuevo, setCampoNuevo] = useState("");
  const [campos, setCampos] = useState([]);
  const dashboardRef = useRef(); // Referencia para exportar el dashboard

  // 🧠 Funciones estadísticas
  const totalTramites = tramites.length;
  const pendientes = tramites.filter(t => t.estado === "Pendiente").length;
  const aprobados = tramites.filter(t => t.estado === "Aprobado").length;
  const rechazados = tramites.filter(t => t.estado === "Rechazado").length;

  const promedioTiempo = () => {
    const tiempos = tramites
      .filter(t => t.reviewedAt)
      .map(t => (new Date(t.reviewedAt) - new Date(t.createdAt)) / (1000 * 60)); // en minutos

    if (tiempos.length === 0) return "-";

    const total = tiempos.reduce((a, b) => a + b, 0);
    const promedio = total / tiempos.length;
    const horas = Math.floor(promedio / 60);
    const minutos = Math.floor(promedio % 60);

    return `${horas}h ${minutos}m`;
  };

  const tramitesHoy = tramites.filter(t => {
    const created = new Date(t.createdAt);
    const now = new Date();
    return created.toDateString() === now.toDateString();
  }).length;

  const handleAddCampo = () => {
    if (campoNuevo.trim() !== "") {
      setCampos([...campos, campoNuevo]);
      setCampoNuevo("");
    }
  };

  const handleCrearTramite = () => {
    if (nombreTramite.trim() && campos.length > 0) {
      addTipoTramite({
        id: Date.now(),
        nombre: nombreTramite,
        campos: campos,
      });
      setNombreTramite("");
      setCampos([]);
      alert("Nuevo tipo de trámite creado exitosamente.");
    } else {
      alert("Completa el nombre del trámite y agrega al menos un campo.");
    }
  };

  // 📥 Función para exportar el dashboard como PDF
  const handleExportDashboard = () => {
    const input = dashboardRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("dashboard_admin.pdf");
    });
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">

        <h2>Panel de Administración</h2>

        {/* BOTÓN EXPORTAR */}
        <div className="exportar-container">
          <button className="btn-exportar" onClick={handleExportDashboard}>
            📥 Exportar Dashboard
          </button>
        </div>

        {/* Dashboard completo que se exporta */}
        <div ref={dashboardRef}>
          
          {/* Dashboard Numérico */}
          <div className="dashboard-grid">
            <div className="card-dashboard">
              <h3>Total Trámites</h3>
              <p>{totalTramites}</p>
            </div>
            <div className="card-dashboard">
              <h3>Pendientes</h3>
              <p>{pendientes}</p>
            </div>
            <div className="card-dashboard">
              <h3>Aprobados</h3>
              <p>{aprobados}</p>
            </div>
            <div className="card-dashboard">
              <h3>Rechazados</h3>
              <p>{rechazados}</p>
            </div>
            <div className="card-dashboard">
              <h3>Tiempo Promedio Resolución</h3>
              <p>{promedioTiempo()}</p>
            </div>
            <div className="card-dashboard">
              <h3>Trámites Hoy</h3>
              <p>{tramitesHoy}</p>
            </div>
          </div>

          {/* Dashboard Gráfico */}
          <div className="visual-dashboard">
            <ChartsDashboard pendientes={pendientes} aprobados={aprobados} rechazados={rechazados} />
            <HeatmapDashboard tramites={tramites} />
          </div>

        </div>

        <hr className="divider" />

        {/* Crear Nuevo Trámite */}
        <h2>Crear Nuevo Tipo de Trámite</h2>

        <div className="form-crear">
          <div className="form-group">
            <label>Nombre del Trámite:</label>
            <input
              type="text"
              value={nombreTramite}
              onChange={(e) => setNombreTramite(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nuevo Campo:</label>
            <input
              type="text"
              value={campoNuevo}
              onChange={(e) => setCampoNuevo(e.target.value)}
            />
            <button className="btn-secondary" type="button" onClick={handleAddCampo}>
              Agregar Campo
            </button>
          </div>

          {campos.length > 0 && (
            <div className="campos-preview">
              <h4>Campos agregados:</h4>
              <ul>
                {campos.map((campo, idx) => (
                  <li key={idx}>{campo}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="btn-primary" type="button" onClick={handleCrearTramite}>
            Crear Trámite
          </button>
        </div>

        <hr className="divider" />

        {/* Tipos de Trámite existentes */}
        <h2>Tipos de Trámite Existentes</h2>
        <div className="tramites-grid">
          {tiposTramite.map((tipo) => (
            <div key={tipo.id} className="tramite-card">
              <h3>{tipo.nombre}</h3>
              <p><strong>Campos:</strong></p>
              <ul>
                {tipo.campos.map((campo, idx) => (
                  <li key={idx}>{campo}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;