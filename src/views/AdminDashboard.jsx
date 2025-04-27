import { lazy, Suspense } from "react";
import { useState, useRef } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import DashboardHeader from "./AdminDashboard/DashboardHeader";
import DashboardCards from "./AdminDashboard/DashboardCards";
import DashboardCharts from "./AdminDashboard/DashboardCharts";
import CrearTramiteForm from "./AdminDashboard/CrearTramiteForm";
import TramitesTable from "./AdminDashboard/TramitesTable";
import TiposTramiteGrid from "./AdminDashboard/TiposTramiteGrid";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const {
    tramites,
    tiposTramite,
    addTipoTramite,
    updateTipoTramite,
    deleteTipoTramite
  } = useTramites();

  const [nombreTramite, setNombreTramite] = useState("");
  const [campoNuevo, setCampoNuevo] = useState("");
  const [campos, setCampos] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 10;
  const dashboardRef = useRef();

  const totalTramites = tramites.length;
  const pendientes = tramites.filter(t => t.estado === "Pendiente").length;
  const aprobados = tramites.filter(t => t.estado === "Aprobado").length;
  const rechazados = tramites.filter(t => t.estado === "Rechazado").length;

  const promedioTiempo = () => {
    const tiempos = tramites
      .filter(t => t.reviewedAt)
      .map(t => (new Date(t.reviewedAt) - new Date(t.createdAt)) / (1000 * 60));
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

  const pagesVisited = pageNumber * itemsPerPage;
  const displayTramites = tramites.slice(pagesVisited, pagesVisited + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleAddCampo = () => {
    if (campoNuevo.trim() !== "") {
      setCampos([...campos, campoNuevo]);
      setCampoNuevo("");
    }
  };

  const handleCrearTramite = () => {
    if (nombreTramite.trim() && campos.length > 0) {
      addTipoTramite({
        id: uuidv4(),
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
        <DashboardHeader onExportDashboard={handleExportDashboard} />
        <div ref={dashboardRef}>
          <DashboardCards
            total={totalTramites}
            pendientes={pendientes}
            aprobados={aprobados}
            rechazados={rechazados}
            promedioTiempo={promedioTiempo()}
            tramitesHoy={tramitesHoy}
          />
          <DashboardCharts
            pendientes={pendientes}
            aprobados={aprobados}
            rechazados={rechazados}
            tramites={tramites}
          />
        </div>

        <hr className="divider" />
        <h2>Crear Nuevo Tipo de Trámite</h2>

        <CrearTramiteForm
          nombreTramite={nombreTramite}
          setNombreTramite={setNombreTramite}
          campoNuevo={campoNuevo}
          setCampoNuevo={setCampoNuevo}
          campos={campos}
          handleAddCampo={handleAddCampo}
          handleCrearTramite={handleCrearTramite}
        />

        <hr className="divider" />
        <h2>Lista de Trámites Recibidos</h2>

        <TramitesTable
          tramites={tramites}
          displayTramites={displayTramites}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />

        <h2>Tipos de Trámite Existentes</h2>

        <TiposTramiteGrid
          tiposTramite={tiposTramite}
          updateTipoTramite={updateTipoTramite}
          deleteTipoTramite={deleteTipoTramite}
        />
      </div>
    </>
  );
};

export default AdminDashboard;