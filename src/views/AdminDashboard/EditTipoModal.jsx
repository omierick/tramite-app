// src/views/AdminDashboard/EditTipoModal.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./EditTipoModal.css";

const EditTipoModal = ({ tipo, isOpen, onClose, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [nuevoCampo, setNuevoCampo] = useState("");
  const [campos, setCampos] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);

  useEffect(() => {
    if (tipo) {
      setNombre(tipo.nombre || "");
      setCampos(tipo.campos || []);
      setEditandoIndex(null);
      setNuevoCampo("");
    }
  }, [tipo]);

  if (!isOpen) return null;

  const agregarOActualizarCampo = () => {
    const campo = nuevoCampo.trim();
    if (!campo) return;

    if (editandoIndex !== null) {
      const actualizados = [...campos];
      actualizados[editandoIndex] = campo;
      setCampos(actualizados);
      setEditandoIndex(null);
    } else {
      if (!campos.includes(campo)) {
        setCampos([...campos, campo]);
      }
    }
    setNuevoCampo("");
  };

  const editarCampo = (index) => {
    setNuevoCampo(campos[index]);
    setEditandoIndex(index);
  };

  const eliminarCampo = (index) => {
    const actualizados = campos.filter((_, i) => i !== index);
    setCampos(actualizados);
    if (editandoIndex === index) {
      setEditandoIndex(null);
      setNuevoCampo("");
    }
  };

  const guardar = () => {
    onSave(tipo.id, { nombre, campos });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Editar Trámite</h3>

        <div className="form-group">
          <label>Nombre del trámite:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del trámite"
          />
        </div>

        <div className="form-group">
          <label>Campos del trámite:</label>
          <div className="campo-add">
            <input
              type="text"
              value={nuevoCampo}
              onChange={(e) => setNuevoCampo(e.target.value)}
              placeholder="Nombre del campo"
            />
            <button className="btn btn-primary" type="button" onClick={agregarOActualizarCampo}>
              {editandoIndex !== null ? "Actualizar" : "Añadir"}
            </button>
          </div>

          <ul className="campos-lista">
            {campos.map((campo, index) => (
              <li key={index}>
                <span>{campo}</span>
                <div className="campo-buttons">
                  <button className="btn btn-edit" onClick={() => editarCampo(index)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => eliminarCampo(index)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={guardar}>
            Guardar
          </button>
          <button className="btn btn-danger" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

EditTipoModal.propTypes = {
  tipo: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

export default EditTipoModal;
