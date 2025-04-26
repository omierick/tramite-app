let tramites = [];
let templates = ['Licencia de Construcción', 'Permiso de Comercio', 'Certificado de Habitabilidad'];

export const api = {
  getTramites: () => tramites,
  addTramite: (data) => {
    tramites.push({...data, id: Date.now(), status: 'Pendiente'});
  },
  updateTramite: (id, status) => {
    tramites = tramites.map(t => t.id === id ? { ...t, status } : t);
  },
  getTemplates: () => templates,
  addTemplate: (template) => {
    templates.push(template);
  }
};

