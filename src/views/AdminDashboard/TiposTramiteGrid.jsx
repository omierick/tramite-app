import PropTypes from "prop-types";

const TiposTramiteGrid = ({ tiposTramite, updateTipoTramite, deleteTipoTramite }) => {
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
            <button
              className="btn-editar"
              onClick={() => {
                const nuevoNombre = prompt("Nuevo nombre para el trámite:", tipo.nombre);
                if (nuevoNombre) {
                  updateTipoTramite(tipo.id, { nombre: nuevoNombre });
                }
              }}
            >
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
    </div>
  );
};

TiposTramiteGrid.propTypes = {
  tiposTramite: PropTypes.array.isRequired,
  updateTipoTramite: PropTypes.func.isRequired,
  deleteTipoTramite: PropTypes.func.isRequired,
};

export default TiposTramiteGrid;