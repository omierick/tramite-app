import { useState } from 'react';
import { api } from '../services/api';
import { sendTramiteEmail } from '../services/mailService';
import { generarPDF } from '../utils/pdfUtils'; // Asegúrate de tener esto

function TramiteForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    tramiteType: '',
    detalles: ''
  });

  const [message, setMessage] = useState('');
  const templates = api.getTemplates();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Guardar trámite y obtener el folio/id generado desde Supabase
      const tramite = await api.addTramite(form);
      const folio = tramite.folio || tramite.id;

      // 2. Generar PDF con el folio incluido (¡muy importante!)
      await generatePDF({ ...form, folio });

      // 3. Mandar email si lo usas (incluye folio si lo necesitas)
      await sendTramiteEmail({ ...form, folio });

      setMessage(`¡Trámite enviado, folio generado: ${folio}! PDF y notificación enviada.`);
      setForm({ nombre: '', apellido: '', dni: '', tramiteType: '', detalles: '' });
    } catch (err) {
      setMessage('Hubo un error al guardar el trámite: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <input className="input" type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <input className="input" type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
      <input className="input" type="text" name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} required />

      <select className="input" name="tramiteType" value={form.tramiteType} onChange={handleChange} required>
        <option value="">Selecciona un tipo de trámite</option>
        {templates.map((tpl, idx) => (
          <option key={idx} value={tpl}>{tpl}</option>
        ))}
      </select>

      <textarea className="input" name="detalles" placeholder="Detalles adicionales" value={form.detalles} onChange={handleChange} required />
      <button className="btn" type="submit">Enviar Trámite</button>

      {message && <p className="text-green-600 font-bold mt-4">{message}</p>}
    </form>
  );
}

export default TramiteForm;