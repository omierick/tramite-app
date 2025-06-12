// src/roles/permissions.js

// Lista central de secciones que puedes usar para roles personalizados
export const ALL_SECTIONS = [
  'BI',
  'Plantillas nueva',
  'Históricos',
  'CRUD',
  'aprobación y rechazo',
  'tramites'
];

// Objeto base de roles iniciales
export const ROLE_PERMISSIONS = {
  admin: {
    secciones: ['BI', 'Plantillas nueva', 'Históricos', 'CRUD'],
    segmentos: [
      'Puede seleccionar uno o varios para crear un rol con admin global, solo BI, plantillas, etc (dinámico)'
    ],
  },
  revisor: {
    secciones: ['aprobación y rechazo'],
    segmentos: [
      'Puede mostrar aprobación y rechazo + BI o lo de los tiempos'
    ],
  },
  usuario: {
    secciones: ['tramites'],
    segmentos: ['Se queda igual'],
  }
};