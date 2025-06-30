import { useState, useRef, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import DashboardHeader from "./AdminDashboard/DashboardHeader";
import DashboardCards from "./AdminDashboard/DashboardCards";
import DashboardCharts from "./AdminDashboard/DashboardCharts";
import CrearTramiteForm from "./AdminDashboard/CrearTramiteForm";
import TramitesTable from "./AdminDashboard/TramitesTable";
import TiposTramiteGrid from "./AdminDashboard/TiposTramiteGrid";
import UserManagement from "../components/UserManagement";
import AreaManagement from "../components/AreaManagement";
import { useAuth } from "../context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const tramitesCtx = useTramites();
  const tramites = tramitesCtx?.tramites || [];
  const tiposTramite = tramitesCtx?.tiposTramite || [];
  const addTipoTramite = tramitesCtx?.addTipoTramite || (() => {});
  const updateTipoTramite = tramitesCtx?.updateTipoTramite || (() => {});
  const deleteTipoTramite = tramitesCtx?.deleteTipoTramite || (() => {});

  const [activeTab, setActiveTab] = useState("dashboard");
  const [nombreTramite, setNombreTramite] = useState("");
  const [campoNuevo, setCampoNuevo] = useState("");
  const [campos, setCampos] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const itemsPerPage = 10;
  const dashboardRef = useRef();

  if (!user) return <div>Cargando usuario...</div>;

  const puedeGestionarUsuarios = user.rol === "admin" || user.rol === "admin_usuarios";
  const puedeVerCharts = ["admin", "admin_charts"].includes(user.rol);
  const puedeVerTramites = ["admin", "admin_tramites"].includes(user.rol);
  const puedeCrearTramite = user.rol === "admin" || user.rol === "admin_tramites";


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

  const tramitesFiltrados = useMemo(() => {
    let filtrados = [...tramites];

    if (filtroEstado !== "todos") {
      filtrados = filtrados.filter(t => t.estado === filtroEstado);
    }

    if (busqueda.trim() !== "") {
      const termino = busqueda.toLowerCase();
      filtrados = filtrados.filter((t) =>
        (t.tipo ?? "").toLowerCase().includes(termino) ||
        (t.solicitante ?? "").toLowerCase().includes(termino) ||
        (t.folio ?? "").toLowerCase().includes(termino)
      );
    }

    if (orden === "recientes") {
      filtrados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (orden === "antiguos") {
      filtrados.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (orden === "tipo") {
      filtrados.sort((a, b) => (a.tipo || "").localeCompare(b.tipo || ""));
    }

    return filtrados;
  }, [tramites, filtroEstado, busqueda, orden]);

  const pagesVisited = pageNumber * itemsPerPage;
  const displayTramites = tramitesFiltrados.slice(pagesVisited, pagesVisited + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleAddCampo = () => {
    if (campoNuevo.trim() !== "") {
      setCampos([...campos, campoNuevo]);
      setCampoNuevo("");
    }
  };

  const handleCrearTramite = (logo = null) => {
    if (nombreTramite.trim() && campos.length > 0) {
      addTipoTramite({
        id: uuidv4(),
        nombre: nombreTramite,
        campos: campos,
        logo_url: logo || null
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

        <div className="tabs-container">
          {puedeVerCharts && (
            <button className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
              Dashboard
            </button>
          )}
          {puedeCrearTramite && (
            <button className={`tab-button ${activeTab === "crear" ? "active" : ""}`} onClick={() => setActiveTab("crear")}>
              Crear Trámite
            </button>
          )}
          
          <button className={`tab-button ${activeTab === "tipos" ? "active" : ""}`} onClick={() => setActiveTab("tipos")}>
            Tipos de Trámite
          </button>
          {puedeVerTramites && (
            <button className={`tab-button ${activeTab === "tramites" ? "active" : ""}`} onClick={() => setActiveTab("tramites")}>
              Trámites
            </button>
          )}
          {puedeGestionarUsuarios && (
            <>
              <button className={`tab-button ${activeTab === "usuarios" ? "active" : ""}`} onClick={() => setActiveTab("usuarios")}>
                Gestión de Usuarios
              </button>
              <button  className={`tab-button ${activeTab === "areas" ? "active" : ""}`}
                        onClick={() => setActiveTab("areas")}
                      >
  Gestión de Áreas
</button>
            </>
          )}
        </div>

        {activeTab === "dashboard" && puedeVerCharts && (
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
        )}

        {activeTab === "crear" && puedeCrearTramite && (
          <CrearTramiteForm
            nombreTramite={nombreTramite}
            setNombreTramite={setNombreTramite}
            campoNuevo={campoNuevo}
            setCampoNuevo={setCampoNuevo}
            campos={campos}
            setCampos={setCampos} // ✅ Esta línea es la clave
            handleCrearTramite={handleCrearTramite}
          />
        )}

        {activeTab === "tramites" && puedeVerTramites && (
          <>
            <div className="filtros-container">
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="Pendiente">Pendientes</option>
                <option value="Aprobado">Aprobados</option>
                <option value="Rechazado">Rechazados</option>
              </select>
              <input
                type="text"
                placeholder="Buscar por solicitante o tipo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
                <option value="tipo">Ordenar por tipo</option>
              </select>
            </div>
            <TramitesTable
              tramites={tramitesFiltrados}
              displayTramites={displayTramites}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}

        {activeTab === "tipos" && (
          <TiposTramiteGrid
            tiposTramite={tiposTramite}
            updateTipoTramite={updateTipoTramite}
            deleteTipoTramite={deleteTipoTramite}
          />
        )}

        {activeTab === "usuarios" && puedeGestionarUsuarios && <UserManagement />}
        {activeTab === "areas" && <AreaManagement />}
      </div>
    </>
  );
};

export default AdminDashboard;
