// src/views/AdminDashboard/EditTipoModal.jsx
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../services/supabaseClient";
import "./EditTipoModal.css";

const EditTipoModal = ({ tipo, isOpen, onClose, onSave }) => {
  const [nombre, setNombre] = useState("");
  const [nuevoCampoNombre, setNuevoCampoNombre] = useState("");
  const [nuevoCampoTipo, setNuevoCampoTipo] = useState("texto");
  const [campos, setCampos] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (tipo) {
      setNombre(tipo.nombre || "");
      setCampos(tipo.campos || []);
      setLogo(null);
      setPreviewLogo(
        typeof tipo.logo === "string" ? tipo.logo : tipo.logo_url || null
      );
      setEditandoIndex(null);
      setNuevoCampoNombre("");
      setNuevoCampoTipo("texto");
    }
  }, [tipo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        const confirmExit = window.confirm(
          "¿Deseas salir sin guardar los cambios?"
        );
        if (confirmExit) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const agregarOActualizarCampo = () => {
    if (!nuevoCampoNombre.trim()) return;

    const campo = { nombre: nuevoCampoNombre.trim(), tipo: nuevoCampoTipo };

    if (editandoIndex !== null) {
      const actualizados = [...campos];
      actualizados[editandoIndex] = campo;
      setCampos(actualizados);
      setEditandoIndex(null);
    } else {
      if (!campos.find((c) => c.nombre === campo.nombre)) {
        setCampos([...campos, campo]);
      }
    }

    setNuevoCampoNombre("");
    setNuevoCampoTipo("texto");
  };

  const editarCampo = (index) => {
    setNuevoCampoNombre(campos[index].nombre);
    setNuevoCampoTipo(campos[index].tipo);
    setEditandoIndex(index);
  };

  const eliminarCampo = (index) => {
    const actualizados = campos.filter((_, i) => i !== index);
    setCampos(actualizados);
    if (editandoIndex === index) {
      setEditandoIndex(null);
      setNuevoCampoNombre("");
      setNuevoCampoTipo("texto");
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("logos-tramites")
        .upload(fileName, file);
      if (error) {
        console.error("Error al subir el logo:", error.message);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("logos-tramites")
        .getPublicUrl(fileName);
      const url = publicUrlData.publicUrl;
      setLogo(url);
      setPreviewLogo(url);
    }
  };

  const guardar = () => {
    onSave(tipo.id, { nombre, campos, logo_url: logo || previewLogo });
  };

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
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
          <label>Logo del trámite:</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          {previewLogo && (
            <div className="logo-preview">
              <img src={previewLogo} alt="Vista previa del logo" height={60} />
            </div>
          )}
        </div>

        <div className="form-group campos-scroll">
          <label>Campos del trámite:</label>
          <div className="campo-add">
            <input
              type="text"
              value={nuevoCampoNombre}
              onChange={(e) => setNuevoCampoNombre(e.target.value)}
              placeholder="Nombre del campo"
            />
            <select
              value={nuevoCampoTipo}
              onChange={(e) => setNuevoCampoTipo(e.target.value)}
            >
              <option value="texto">Texto</option>
              <option value="numero">Número</option>
              <option value="booleano">Booleano</option>
              <option value="fecha">Fecha</option>
              <option value="archivo">Archivo</option>
              <option value="coordenadas">Ubicación (Coordenadas)</option>
            </select>
            <button
              className="btn btn-primary"
              type="button"
              onClick={agregarOActualizarCampo}
            >
              {editandoIndex !== null ? "Actualizar" : "Añadir"}
            </button>
          </div>

          <ul className="campos-lista">
            {campos.map((campo, index) => (
              <li key={index}>
                <span>
                  {campo.nombre} <em>({campo.tipo})</em>
                </span>
                <div className="campo-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => editarCampo(index)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => eliminarCampo(index)}
                  >
                    Eliminar
                  </button>
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
