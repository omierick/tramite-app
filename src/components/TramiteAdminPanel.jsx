import { useState } from 'react';
import { api } from '../services/api';

function TramiteAdminPanel() {
  const [template, setTemplate] = useState('');
  const [templates, setTemplates] = useState(api.getTemplates());

  const handleAddTemplate = () => {
    if (template.trim() !== '') {
      api.addTemplate(template);
      setTemplates(api.getTemplates());
      setTemplate('');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <input
        className="input"
        type="text"
        placeholder="Nuevo tipo de trámite"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
      />
      <button className="btn" onClick={handleAddTemplate}>Agregar Plantilla</button>

      <h3 className="text-xl mt-6 font-bold">Plantillas Disponibles</h3>
      <ul className="list-disc pl-6">
        {templates.map((tpl, idx) => (
          <li key={idx}>{tpl}</li>
        ))}
      </ul>
    </div>
  );
}

export default TramiteAdminPanel;

