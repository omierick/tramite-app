
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import FirmaCanvas from "../components/FirmaCanvas";
import { toast } from "react-toastify";
import { generatePDF } from "../utils/pdfUtils";
import { sendTramiteEmail } from "../services/emailService";
import "./UserDashboard.css";

const schema = yup.object().shape({
  email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
  firma: yup.string().required("Debes firmar el trámite antes de enviarlo"),
});

const UserDashboard = ({ setRole }) => {
  const {
    tramites,
    tiposTramite,
    nombreUsuario,
    setNombreUsuario,
    addTramite,
    updateTramiteCampos
  } = useTramites();

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
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!nombreUsuario && tramites.length > 0) {
      const tramiteConNombre = tramites.find(t => t.solicitante);
      if (tramiteConNombre) {
        setNombreUsuario(tramiteConNombre.solicitante);
      }
    }
  }, [nombreUsuario, tramites]);

  const handleSelectChange = (e) => {
    setTramiteSeleccionadoId(e.target.value);
  };

  const handleSelectSubmit = (e) => {
    e.preventDefault();
    const tipo = tiposTramite.find(tipo => tipo.id.toString() === tramiteSeleccionadoId);
    if (tipo) {
      setSelectedTipo(tipo);
      const initialData = {};
      tipo.campos.forEach(campo => {
        initialData[campo] = "";
      });
      setFormData(initialData);
    } else {
      toast.error("Selecciona un trámite válido");
    }
  };

  const handleChange = (e, campo) => {
    setFormData({ ...formData, [campo]: e.target.value });
  };

  const onSubmit = async () => {
    const email = getValues("email");

    if (!nombreUsuario) {
      toast.error("Debes ingresar tu nombre antes de enviar un trámite.");
      return;
    }

    if (!firma) {
      toast.error("Por favor guarda tu firma antes de enviar.");
      return;
    }

    if (editandoTramite) {
      await updateTramiteCampos(editandoTramite.id, {
        campos: formData,
        estado: "Pendiente",
        firma: firma,
      });
      toast.success("¡Trámite corregido! Se enviará nuevamente a revisión.");
      setEditandoTramite(null);
    } else {
      const nuevoTramite = {
  tipo: selectedTipo.nombre,
  campos: formData,
  firma,
  estado: "Pendiente",
  solicitante: nombreUsuario,
  email,
  createdAt: new Date().toISOString(), // 🟢 asegúrate de incluir esto
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
    setSelectedTipo(tiposTramite.find(t => t.nombre === tramite.tipo));
    setFormData(tramite.campos);
  };

  const handleDescargarTramite = (tramite) => {
    const tramiteConFechas = {
      ...tramite,
      tipo: tramite.tipo,
      estado: tramite.estado,
      createdAt: tramite.createdAt || new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
    };
    generatePDF(tramiteConFechas);
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(true);

  const tramitesUsuario = useMemo(() => {
    return tramites.filter(t => t.solicitante === nombreUsuario);
  }, [tramites, nombreUsuario]);

  return (
    <>
      <Navbar />
      <div className="user-container">
        <h2>Mis Trámites</h2>
        <button onClick={() => {
          setNombreUsuario("");
          setMostrarFormulario(true);
        }} className="btn-secondary" style={{ marginBottom: "1rem" }}>
          Cambiar nombre y correo
        </button>

        {(!nombreUsuario || mostrarFormulario) ? (
          <div className="nombre-usuario-form">
            <h3>Antes de comenzar, ingresa tu nombre:</h3>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Tu correo electrónico"
              {...register("email")}
              required
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <button
              className="btn-primary"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                if (nombreUsuario && !errors.email) setMostrarFormulario(false);
              }}
            >
              Continuar
            </button>
          </div>
        ) : editandoTramite || selectedTipo ? (
          <form className="tramite-form" onSubmit={handleSubmit(onSubmit)}>
            <h3>{editandoTramite ? "Editar Trámite Rechazado" : `Nuevo Trámite: ${selectedTipo.nombre}`}</h3>

            {selectedTipo.campos.map((campo, idx) => (
              <div key={idx} className="form-group">
                <label>{campo}:</label>
                <input
                  type="text"
                  value={formData[campo] || ""}
                  onChange={(e) => handleChange(e, campo)}
                  required
                />
              </div>
            ))}

            <div className="form-group">
              <label>Firma del solicitante:</label>
              <FirmaCanvas setFirma={(firmaData) => {
                setFirma(firmaData);
                setValue("firma", firmaData);
              }} />
            </div>

            {errors.firma && <p className="error">{errors.firma.message}</p>}

            <button className="btn-primary" type="submit">
              {editandoTramite ? "Enviar Corrección" : "Enviar Trámite"}
            </button>
          </form>
        ) : (
          <form className="tramite-form" onSubmit={handleSelectSubmit}>
            <div className="form-group">
              <label>Selecciona un tipo de trámite:</label>
              <select onChange={handleSelectChange} value={tramiteSeleccionadoId} required>
                <option value="">-- Selecciona un trámite --</option>
                {tiposTramite.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary" type="submit">Continuar</button>
          </form>
        )}

        {tramitesUsuario.length > 0 && (
          <div className="mis-tramites">
            <h3>Mis Trámites Enviados</h3>
            <table className="tabla-tramites">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tramitesUsuario.map((tramite) => (
                  <tr key={tramite.id}>
                    <td>{tramite.tipo}</td>
<td className={`estado ${tramite.estado.toLowerCase()}`}>
  <span style={{ fontWeight: "bold" }}>{tramite.estado}</span>
  {tramite.estado === "Aprobado" && tramite.reviewedAt && (
    <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "4px" }}>
      <i className="fas fa-calendar-check" style={{ marginRight: "4px" }}></i>
      {new Date(tramite.reviewedAt).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })}
    </div>
  )}
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
                          style={{ marginLeft: "0.5rem" }}
                        >
                          Descargar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
