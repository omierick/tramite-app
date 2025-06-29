import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTramites } from "../context/TramitesContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FirmaCanvas from "../components/FirmaCanvas";
import { toast } from "react-toastify";
import { generatePDF } from "../utils/pdfUtils";
import { sendTramiteEmail } from "../services/emailService";
import "./UserDashboard.css";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  firma: yup.string().required("Debes firmar el trámite antes de enviarlo"),
});

const formatFechaManual = (isoString) => {
  const date = new Date(isoString);
  const mxDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Mexico_City" })
  );

  const dia = String(mxDate.getDate()).padStart(2, "0");
  const mes = String(mxDate.getMonth() + 1).padStart(2, "0");
  const anio = mxDate.getFullYear();
  const horas = String(mxDate.getHours()).padStart(2, "0");
  const minutos = String(mxDate.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
};

const UserDashboard = ({ setRole }) => {
  const { user } = useAuth();
  const { tramites, tiposTramite, addTramite, updateTramiteCampos } =
    useTramites();

  const [tramiteSeleccionadoId, setTramiteSeleccionadoId] = useState("");
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [formData, setFormData] = useState({});
  const [firma, setFirma] = useState(null);
  const [editandoTramite, setEditandoTramite] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleSelectChange = (e) => setTramiteSeleccionadoId(e.target.value);

  const handleSelectSubmit = (e) => {
    e.preventDefault();
    const tipo = tiposTramite.find(
      (tipo) => tipo.id.toString() === tramiteSeleccionadoId
    );
    if (tipo) {
      setSelectedTipo(tipo);
      const initialData = {};
      tipo.campos.forEach((campo) => {
        if (typeof campo === "object")
          initialData[campo.nombre] = campo.tipo === "booleano" ? false : "";
      });
      setFormData(initialData);
    } else {
      toast.error("Selecciona un trámite válido");
    }
  };

  const handleChange = (e, campo) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [campo]: value });
  };

  const onSubmit = async () => {
    const email = getValues("email");
    if (!firma) {
      toast.error("Por favor guarda tu firma antes de enviar.");
      return;
    }

    if (editandoTramite) {
      await updateTramiteCampos(editandoTramite.id, {
        campos: formData,
        estado: "Pendiente",
        firma,
      });
      toast.success("¡Trámite corregido! Se enviará nuevamente a revisión.");
      setEditandoTramite(null);
    } else {
      const nuevoTramite = {
        tipo: selectedTipo.nombre,
        tipo_tramite_id: selectedTipo.id, // <-- ESTA LÍNEA AGREGA LA RELACIÓN CON EL ÁREA
        campos: formData,
        firma,
        logo_url: selectedTipo?.logo_url || null,
        estado: "Pendiente",
        solicitante: user.correo,
        email,
        createdAt: new Date().toISOString(),
      };
      await addTramite(nuevoTramite);
      await sendTramiteEmail(nuevoTramite);
      toast.success("¡Trámite enviado correctamente!");
    }
    resetFormulario();
  };

  const resetFormulario = () => {
    setSelectedTipo(null);
    setFirma(null);
    setFormData({});
    setTramiteSeleccionadoId("");
  };

  const handleEditarTramite = (tramite) => {
    setEditandoTramite(tramite);
    setSelectedTipo(tiposTramite.find((t) => t.nombre === tramite.tipo));
    setFormData(tramite.campos);
  };

  const handleDescargarTramite = (tramite) => {
    const tramiteConFechas = {
      ...tramite,
      createdAt: tramite.createdAt || new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
    };
    generatePDF(tramiteConFechas);
  };

  const tramitesUsuario = useMemo(
    () => tramites.filter((t) => t.solicitante === user.correo),
    [tramites, user]
  );

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");

  const tramitesFiltrados = useMemo(() => {
    let filtrados = [...tramitesUsuario];
    if (filtroEstado !== "todos")
      filtrados = filtrados.filter((t) => t.estado === filtroEstado);
    if (busqueda.trim() !== "") {
      const termino = busqueda.toLowerCase();
      filtrados = filtrados.filter(
        (t) =>
          (t.tipo ?? "").toLowerCase().includes(termino) ||
          String(t.folio ?? "")
            .toLowerCase()
            .includes(termino)
      );
    }
    if (orden === "recientes")
      filtrados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (orden === "antiguos")
      filtrados.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (orden === "tipo")
      filtrados.sort((a, b) => (a.tipo || "").localeCompare(b.tipo || ""));
    return filtrados;
  }, [tramitesUsuario, filtroEstado, busqueda, orden]);

  return (
    <>
      <Navbar />
      <div className="user-container">
        <h2>Mis Trámites</h2>

        {editandoTramite || selectedTipo ? (
          <form className="tramite-form" onSubmit={handleSubmit(onSubmit)}>
            <h3>
              {editandoTramite
                ? "Editar Trámite Rechazado"
                : `Nuevo Trámite: ${selectedTipo.nombre}`}
            </h3>

            {selectedTipo.campos.map((campo, idx) => {
              if (typeof campo !== "object" || !campo.nombre || !campo.tipo)
                return null;
              const value = formData[campo.nombre];
              return (
                <div key={idx} className="form-group">
                  <label>{campo.nombre}:</label>
                  {campo.tipo === "booleano" ? (
                    <input
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) => handleChange(e, campo.nombre)}
                    />
                  ) : campo.tipo === "número" || campo.tipo === "numero" ? (
                    <input
                      type="number"
                      value={value || ""}
                      onChange={(e) => handleChange(e, campo.nombre)}
                    />
                  ) : campo.tipo === "fecha" ? (
                    <input
                      type="date"
                      value={value || ""}
                      onChange={(e) => handleChange(e, campo.nombre)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value || ""}
                      onChange={(e) => handleChange(e, campo.nombre)}
                    />
                  )}
                </div>
              );
            })}

            <div className="form-group">
              <label>Correo electrónico para actualizaciones:</label>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                {...register("email")}
                required
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label>Firma del solicitante:</label>
              <FirmaCanvas
                setFirma={(firmaData) => {
                  setFirma(firmaData);
                  setValue("firma", firmaData);
                }}
              />
              {errors.firma && <p className="error">{errors.firma.message}</p>}
            </div>

            <button className="btn-primary" type="submit">
              {editandoTramite ? "Enviar Corrección" : "Enviar Trámite"}
            </button>
          </form>
        ) : (
          <form className="tramite-form" onSubmit={handleSelectSubmit}>
            <div className="form-group">
              <label>Selecciona un tipo de trámite:</label>
              <select
                onChange={handleSelectChange}
                value={tramiteSeleccionadoId}
                required
              >
                <option value="">-- Selecciona un trámite --</option>
                {tiposTramite.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary" type="submit">
              Continuar
            </button>
          </form>
        )}

        {tramitesUsuario.length > 0 && (
          <div className="mis-tramites">
            <h3>Mis Trámites Enviados</h3>

            <div className="filtros-container">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
              <input
                type="text"
                placeholder="Buscar por tipo o folio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
                <option value="tipo">Ordenar por tipo</option>
              </select>
            </div>

            <table className="tabla-tramites">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Fecha de Solicitud</th>
                  <th>Fecha de Revisión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tramitesFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "1rem",
                        color: "#777",
                      }}
                    >
                      No se encontraron coincidencias.
                    </td>
                  </tr>
                ) : (
                  tramitesFiltrados.map((tramite) => (
                    <tr key={tramite.id}>
                      <td
                        style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                      >
                        {tramite.folio || "Sin folio"}
                      </td>
                      <td>{tramite.tipo}</td>
                      <td className={`estado ${tramite.estado.toLowerCase()}`}>
                        <span style={{ fontWeight: "bold" }}>
                          {tramite.estado}
                        </span>
                        {tramite.estado === "Rechazado" &&
                          tramite.comentario_revisor && (
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "#c00",
                                marginTop: "4px",
                              }}
                            >
                              <i
                                className="fas fa-info-circle"
                                style={{ marginRight: "4px" }}
                              ></i>
                              <strong>Motivo:</strong>{" "}
                              {tramite.comentario_revisor}
                            </div>
                          )}
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "#444" }}>
                        {tramite.createdAt
                          ? formatFechaManual(tramite.createdAt)
                          : "Desconocida"}
                      </td>
                      <td
                        style={{
                          fontSize: "0.85rem",
                          color: tramite.reviewedAt ? "#444" : "#888",
                        }}
                      >
                        {tramite.reviewedAt
                          ? formatFechaManual(tramite.reviewedAt)
                          : "Sin revisión"}
                      </td>
                      <td>
                        {tramite.estado === "Rechazado" && (
                          <button
                            className="btn-secondary"
                            onClick={() => handleEditarTramite(tramite)}
                          >
                            Editar
                          </button>
                        )}
                        {tramite.estado === "Aprobado" && (
                          <button
                            className="btn-secondary"
                            onClick={() => handleDescargarTramite(tramite)}
                          >
                            Descargar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
