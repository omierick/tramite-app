import { useState, useEffect } from "react";
import { api } from "../services/api";
import { sendTramiteEmail } from "../services/mailService";
import { generarPDF } from "../utils/pdfUtils";

function TramiteForm() {
  const [form, setForm] = useState({});
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    api.getTemplates()
      .then((tpls) => {
        console.log("✅ Templates cargados:", tpls);
        setTemplates(tpls);
      })
      .catch((err) => {
        console.error("❌ Error cargando templates:", err);
      });
  }, []);

  useEffect(() => {
    if (tipoSeleccionado) {
      const campos = tipoSeleccionado.campos || [];
      console.log("📄 Tipo seleccionado:", tipoSeleccionado);
      const initialForm = {};
      campos.forEach((campo, idx) => {
        console.log(`🔧 Campo inicial ${idx}:`, campo);
        const nombreCampo = typeof campo.nombre === "string" ? campo.nombre : JSON.stringify(campo.nombre);
        initialForm[nombreCampo] = campo.tipo === "booleano" ? false : "";
      });
      console.log("🧾 Campos inicializados:", initialForm);
      setForm(initialForm);
    }
  }, [tipoSeleccionado]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const val = type === "checkbox" ? checked : type === "file" ? files[0] : value;
    console.log(`✏️ Cambio en campo → ${name}: `, val);
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Formulario a enviar:", form);

    try {
      const dataEnviar = {
        ...form,
        tipo_tramite_id: tipoSeleccionado.id,
        tipo_tramite_nombre: tipoSeleccionado.nombre,
      };
      console.log("📤 Datos enviados a Supabase:", dataEnviar);

      const tramite = await api.addTramite(dataEnviar);
      console.log("✅ Respuesta Supabase:", tramite);

      const folio = tramite.folio || tramite.id;
      await generarPDF({ ...form, folio });
      await sendTramiteEmail({ ...form, folio });

      setMessage(`¡Trámite enviado, folio generado: ${folio}! PDF y notificación enviada.`);
      setForm({});
    } catch (err) {
      console.error("❌ Error al guardar trámite:", err);
      setMessage("Hubo un error al guardar el trámite: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <select
        className="input"
        onChange={(e) => {
          const selected = templates.find((t) => String(t.id) === e.target.value);
          console.log("📌 Tipo de trámite seleccionado:", selected);
          setTipoSeleccionado(selected);
        }}
        required
      >
        <option value="">Selecciona un tipo de trámite</option>
        {templates.map((tpl) => (
          <option key={tpl.id} value={tpl.id}>
            {tpl.nombre}
          </option>
        ))}
      </select>

      {tipoSeleccionado &&
        tipoSeleccionado.campos.map((campo, idx) => {
          console.log(`🔍 Render campo[${idx}]:`, campo);

          if (!campo || typeof campo !== "object") {
            console.error("❌ Campo inválido, no es objeto:", campo);
            return null;
          }

          if (typeof campo.nombre !== "string" || typeof campo.tipo !== "string") {
            console.error("❌ Campo inválido: nombre o tipo no son string:", campo);
            return (
              <p key={idx} className="text-red-500">
                Error: El campo #{idx + 1} tiene estructura inválida.
              </p>
            );
          }

          const nombreCampo = campo.nombre;
          const tipo = campo.tipo;
          const value = form[nombreCampo] || "";

          switch (tipo) {
            case "booleano":
              return (
                <label key={idx} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name={nombreCampo}
                    checked={!!value}
                    onChange={handleChange}
                  />
                  <span>{String(nombreCampo)}</span>
                </label>
              );

            case "archivo":
              return (
                <label key={idx} className="flex flex-col">
                  <span>{String(nombreCampo)}:</span>
                  <input type="file" name={nombreCampo} onChange={handleChange} />
                </label>
              );

            case "fecha":
              return (
                <label key={idx} className="flex flex-col">
                  <span>{String(nombreCampo)}:</span>
                  <input
                    type="date"
                    name={nombreCampo}
                    value={value}
                    onChange={handleChange}
                  />
                </label>
              );

            case "ubicacion":
              return (
                <label key={idx} className="flex flex-col">
                  <span>{String(nombreCampo)}:</span>
                  <input
                    type="text"
                    placeholder="lat,long"
                    name={nombreCampo}
                    value={value}
                    onChange={handleChange}
                  />
                </label>
              );

            case "número":
            case "numero":
              return (
                <label key={idx} className="flex flex-col">
                  <span>{String(nombreCampo)}:</span>
                  <input
                    type="number"
                    name={nombreCampo}
                    value={value}
                    onChange={handleChange}
                  />
                </label>
              );

            case "texto":
            default:
              return (
                <label key={idx} className="flex flex-col">
                  <span>{String(nombreCampo)}:</span>
                  <input
                    type="text"
                    name={nombreCampo}
                    value={value}
                    onChange={handleChange}
                  />
                </label>
              );
          }
        })}

      <button className="btn" type="submit">
        Enviar Trámite
      </button>
      {message && <p className="text-green-600 font-bold mt-4">{message}</p>}
    </form>
  );
}

export default TramiteForm;