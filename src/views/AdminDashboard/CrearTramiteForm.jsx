import { useState } from "react";
import { supabase } from "../../services/supabaseClient";

const CrearTramiteForm = ({
  nombreTramite,
  setNombreTramite,
  campoNuevo,
  setCampoNuevo,
  campos,
  handleAddCampo,
  handleCrearTramite
}) => {
  const [logoFile, setLogoFile] = useState(null);

  const handleLogoUpload = async () => {
    if (!logoFile) return null;

    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("logos-tramites").upload(fileName, logoFile);

    if (error) {
      console.error("Error al subir logo:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from("logos-tramites")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const logo = await handleLogoUpload(); // puede ser null
    handleCrearTramite(logo);
  };

  return (
    <form onSubmit={handleSubmit} className="crear-tramite-form">
      <input
        type="text"
        placeholder="Nombre del trámite"
        value={nombreTramite}
        onChange={(e) => setNombreTramite(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Agregar campo"
        value={campoNuevo}
        onChange={(e) => setCampoNuevo(e.target.value)}
      />
      <button type="button" onClick={handleAddCampo}>Añadir campo</button>

      <div>
        <label>Logo (opcional):</label>
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
      </div>

      <button type="submit">Crear trámite</button>
    </form>
  );
};

export default CrearTramiteForm;