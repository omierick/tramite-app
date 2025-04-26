import emailjs from 'emailjs-com';

export const enviarCorreoNotificacion = (dataTramite) => {
  const templateParams = {
    name: dataTramite.nombreSolicitante,
    message: `Nuevo trámite recibido.\n
Tipo de trámite: ${dataTramite.tipoTramite}\n
Fecha de solicitud: ${new Date().toLocaleDateString()}\n
Detalles:\n${dataTramite.detalles}`
  };

  return emailjs.send('service_6ti57qy', 'template_t5o2ki8', templateParams, 'SUpfpJKE0aL-57jn0');
};