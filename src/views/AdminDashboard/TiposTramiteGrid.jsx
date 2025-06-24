import { useState } from "react";
import PropTypes from "prop-types";
import EditTipoModal from "./EditTipoModal"; // Está en la misma carpeta
import "./EditTipoModal.css"; // Asegúrate de tener este CSS en la misma carpeta

const TiposTramiteGrid = ({ tiposTramite, updateTipoTramite, deleteTipoTramite }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);

  const abrirModal = (tipo) => {
    setTipoEditando(tipo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setTipoEditando(null);
    setModalAbierto(false);
  };

  // ✅ Ahora acepta nombre y campos
  const guardarCambios = (id, datosActualizados) => {
    updateTipoTramite(id, datosActualizados); // { nombre, campos }
    cerrarModal();
  };

  return (
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

          <div className="acciones-tramite">
            <button className="btn-editar" onClick={() => abrirModal(tipo)}>
              ✏️ Editar
            </button>
            <button
              className="btn-eliminar"
              onClick={() => {
                if (confirm("¿Seguro que deseas eliminar este tipo de trámite?")) {
                  deleteTipoTramite(tipo.id);
                }
              }}
            >
              ❌ Eliminar
            </button>
          </div>
        </div>
      ))}

      {modalAbierto && tipoEditando && (
        <EditTipoModal
          tipo={tipoEditando}
          isOpen={modalAbierto}
          onClose={cerrarModal}
          onSave={guardarCambios} // ✅ guarda nombre y campos
        />
      )}
    </div>
  );
};

TiposTramiteGrid.propTypes = {
  tiposTramite: PropTypes.array.isRequired,
  updateTipoTramite: PropTypes.func.isRequired,
  deleteTipoTramite: PropTypes.func.isRequired,
};

export default TiposTramiteGrid;
