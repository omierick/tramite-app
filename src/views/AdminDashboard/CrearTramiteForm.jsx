import PropTypes from "prop-types";

const CrearTramiteForm = ({
  nombreTramite,
  setNombreTramite,
  campoNuevo,
  setCampoNuevo,
  campos,
  handleAddCampo,
  handleCrearTramite
}) => {
  return (
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
  );
};

CrearTramiteForm.propTypes = {
  nombreTramite: PropTypes.string.isRequired,
  setNombreTramite: PropTypes.func.isRequired,
  campoNuevo: PropTypes.string.isRequired,
  setCampoNuevo: PropTypes.func.isRequired,
  campos: PropTypes.array.isRequired,
  handleAddCampo: PropTypes.func.isRequired,
  handleCrearTramite: PropTypes.func.isRequired,
};

export default CrearTramiteForm;