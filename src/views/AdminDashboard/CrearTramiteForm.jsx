// src/components/tramites/CrearTramiteForm.jsx
import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "../../components/tramites/CrearTramiteForm.css"; // ✅


const CrearTramiteForm = ({
  nombreTramite,
  setNombreTramite,
  campoNuevo,
  setCampoNuevo,
  campos,
  setCampos,
  handleCrearTramite,
}) => {
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState("");
  const [editandoCampoIndex, setEditandoCampoIndex] = useState(null);

  const handleLogoUpload = async () => {
    if (!logoFile) return null;

    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("logos-tramites")
      .upload(fileName, logoFile);

    if (error) {
      console.error("Error al subir logo:", error.message);
      setError("Error al subir el logo.");
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("logos-tramites")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (campos.length === 0) {
      setError("Agrega al menos un campo al trámite.");
      return;
    }

    const logo = await handleLogoUpload();
    handleCrearTramite(logo);
  };

  const handleAddOrUpdateCampo = () => {
    const nuevoCampo = campoNuevo.trim();
    if (!nuevoCampo) {
      setError("El campo no puede estar vacío.");
      return;
    }

    const camposNormalizados = campos.map((c) => c.toLowerCase());
    const duplicado = camposNormalizados.includes(nuevoCampo.toLowerCase());

    if (editandoCampoIndex !== null) {
      const actual = campos[editandoCampoIndex];
      if (nuevoCampo.toLowerCase() !== actual.toLowerCase() && duplicado) {
        setError("Ese campo ya existe.");
        return;
      }

      const nuevos = [...campos];
      nuevos[editandoCampoIndex] = nuevoCampo;
      setCampos(nuevos);
      setEditandoCampoIndex(null);
    } else {
      if (duplicado) {
        setError("Ese campo ya existe.");
        return;
      }
      setCampos([...campos, nuevoCampo]);
    }

    setCampoNuevo("");
    setError("");
  };

  const handleEditarCampo = (index) => {
    setCampoNuevo(campos[index]);
    setEditandoCampoIndex(index);
  };

  const handleEliminarCampo = (index) => {
    const nuevos = campos.filter((_, i) => i !== index);
    setCampos(nuevos);
    if (editandoCampoIndex === index) {
      setCampoNuevo("");
      setEditandoCampoIndex(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Crear Nuevo Trámite</h2>

      <div className="form-group">
        <label>Nombre del trámite</label>
        <input
          type="text"
          value={nombreTramite}
          onChange={(e) => setNombreTramite(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Agregar campo</label>
        <div className="campo-input-group">
          <input
            type="text"
            value={campoNuevo}
            onChange={(e) => setCampoNuevo(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddOrUpdateCampo}
            className="btn btn-primary"
          >
            {editandoCampoIndex !== null ? "Actualizar" : "Añadir"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}

        {campos.length > 0 && (
          <table className="campos-table">
            <thead>
              <tr>
                <th>Campo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {campos.map((campo, index) => (
                <tr key={index}>
                  <td>{campo}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => handleEditarCampo(index)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleEliminarCampo(index)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="form-group">
        <label>Logo (opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setLogoFile(file);
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const img = document.getElementById("logo-preview");
                if (img) img.src = reader.result;
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <img id="logo-preview" alt="Vista previa del logo" className="logo-preview" />
      </div>

      <button type="submit" className="btn btn-primary">
        Crear trámite
      </button>
    </form>
  );
};

export default CrearTramiteForm;