import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import FirmaCanvas from "../components/FirmaCanvas";
import { toast } from 'react-toastify';
import { enviarCorreoNotificacion } from "../services/emailService";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { tiposTramite, tramites, addTramite } = useTramites();
  const [tramiteSeleccionadoId, setTramiteSeleccionadoId] = useState('');
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [firma, setFirma] = useState(null);
  const [enviado, setEnviado] = useState(false);

  const handleSelectChange = (e) => {
    setTramiteSeleccionadoId(e.target.value);
  };

  const handleSelectSubmit = (e) => {
    e.preventDefault();
    const tramite = tiposTramite.find(tipo => tipo.id.toString() === tramiteSeleccionadoId);
    if (tramite) {
      setSelected(tramite);
      const initialData = {};
      tramite.campos.forEach(campo => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firma) {
      toast.error("Por favor guarda tu firma antes de enviar.");
      return;
    }

    const nuevoTramite = {
      tipo: selected.nombre,
      campos: formData,
      firma: firma, // 🔥
      estado: "Pendiente",
      createdAt: new Date().toISOString() // 📅
    };

    await addTramite(nuevoTramite);

    enviarCorreoNotificacion({
      nombreSolicitante: formData["Nombre del solicitante"] || "No especificado",
      tipoTramite: selected.nombre,
      detalles: Object.entries(formData)
        .map(([campo, valor]) => `${campo}: ${valor}`)
        .join("\n")
    })
    .then(() => {
      console.log('Correo enviado.');
      toast.success("Trámite enviado correctamente.");
    })
    .catch((error) => {
      console.error('Error enviando correo:', error);
      toast.error("Trámite enviado pero hubo un error enviando el correo.");
    });

    setEnviado(true);
  };

  const resetFormulario = () => {
    setEnviado(false);
    setSelected(null);
    setFirma(null);
    setTramiteSeleccionadoId('');
    setFormData({});
  };

  return (
    <>
      <Navbar />
      <div className="user-container">
        <h2>Mis Trámites</h2>

        {enviado ? (
          <div className="success-message">
            <h3>¡Trámite enviado exitosamente!</h3>
            <button className="btn-primary" onClick={resetFormulario}>
              Realizar otro trámite
            </button>
          </div>
        ) : !selected ? (
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
        ) : (
          <form className="tramite-form" onSubmit={handleSubmit}>
            <h3>Iniciar Trámite: {selected.nombre}</h3>

            {selected.campos.map((campo, idx) => (
              <div key={idx} className="form-group">
                <label>{campo}:</label>
                <input
                  type="text"
                  value={formData[campo]}
                  onChange={(e) => handleChange(e, campo)}
                  required
                />
              </div>
            ))}

            <div className="form-group">
              <label>Firma del solicitante:</label>
              <FirmaCanvas setFirma={setFirma} />
            </div>

            <button className="btn-primary" type="submit">Enviar Trámite</button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserDashboard;