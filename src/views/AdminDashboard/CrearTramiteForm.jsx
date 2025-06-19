import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "../../components/tramites/CrearTramiteForm.css";


const CrearTramiteForm = ({
  nombreTramite,
  setNombreTramite,
  campoNuevo,
  setCampoNuevo,
  campos,
  handleAddCampo,
  handleCrearTramite,
}) => {
  const [logoFile, setLogoFile] = useState(null);

  const handleLogoUpload = async () => {
    if (!logoFile) return null;

    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("logos-tramites")
      .upload(fileName, logoFile);

    if (error) {
      console.error("Error al subir logo:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("logos-tramites")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const logo = await handleLogoUpload();
    handleCrearTramite(logo);
  };

  return (
   <form onSubmit={handleSubmit} className="form-container">
  <h2 className="form-title">Crear Nuevo Trámite</h2>

  {/* Nombre del trámite */}
  <div className="form-group">
    <label>Nombre del trámite</label>
    <input
      type="text"
      value={nombreTramite}
      onChange={(e) => setNombreTramite(e.target.value)}
      required
    />
  </div>

  {/* Campos dinámicos */}
  <div className="form-group">
    <label>Agregar campo</label>
    <div style={{ display: "flex", gap: "10px" }}>
      <input
        type="text"
        value={campoNuevo}
        onChange={(e) => setCampoNuevo(e.target.value)}
      />
      <button
        type="button"
        onClick={handleAddCampo}
        className="btn btn-primary"
      >
        Añadir
      </button>
    </div>
    {campos.length > 0 && (
      <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
        {campos.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    )}
  </div>

  {/* Logo */}
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

  {/* Botón principal */}
  <button type="submit" className="btn btn-primary">
    Crear trámite
  </button>
</form>


  );
};

export default CrearTramiteForm;
