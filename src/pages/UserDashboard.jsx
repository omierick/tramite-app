import { useState } from "react";
import { useTramites } from "../context/TramitesContext";
import Navbar from "../components/Navbar";
import { toast } from 'react-toastify';
import { enviarCorreoNotificacion } from "../services/emailService";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { tiposTramite, tramites, addTramite } = useTramites();
  const [tramiteSeleccionadoId, setTramiteSeleccionadoId] = useState('');
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoTramite = {
      tipo: selected.nombre,
      campos: formData,
      estado: "Pendiente"
    };

    addTramite(nuevoTramite);

    enviarCorreoNotificacion({
      nombreSolicitante: formData["Nombre del solicitante"] || "No especificado",
      tipoTramite: selected.nombre,
      detalles: Object.entries(formData)
        .map(([campo, valor]) => `${campo}: ${valor}`)
        .join("\n")
    })
    .then(() => {
      console.log('Correo enviado con éxito.');
      toast.success("Trámite creado y correo enviado exitosamente");
    })
    .catch((error) => {
      console.error('Error al enviar el correo:', error);
      toast.error("Trámite creado, pero hubo un error al enviar el correo");
    });

    setEnviado(true);
  };

  const resetFormulario = () => {
    setEnviado(false);
    setSelected(null);
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
            <p>Gracias por completar tu trámite.</p>
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
            <button className="btn-primary" type="submit">Enviar Trámite</button>
          </form>
        )}

        {/* Lista de trámites enviados */}
        {tramites.length > 0 && (
          <div className="mis-tramites">
            <h3>Mis Trámites Enviados</h3>
            <table className="tabla-tramites">
              <thead>
                <tr>
                  <th>Tipo de Trámite</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tramites.map((tramite, idx) => (
                  <tr key={idx}>
                    <td>{tramite.tipo}</td>
                    <td className={`estado ${tramite.estado.toLowerCase()}`}>
                      {tramite.estado === "Pendiente" && "⏳ Pendiente"}
                      {tramite.estado === "Aprobado" && "✅ Aprobado"}
                      {tramite.estado === "Rechazado" && "❌ Rechazado"}
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