// src/services/emailService.js
import emailjs from "@emailjs/browser";

export const sendTramiteEmail = async (tramite) => {
  try {
    const serviceId = "service_6ti57qy"; // 👈 tu service_id
    const templateId = "template_t5o2ki8"; // 👈 tu template_id
    const publicKey = "SUpfpJKE0aL-57jn0"; // 👈 tu public_key

    const detalles = Object.entries(tramite.campos || {})
      .map(([campo, valor]) => `- ${campo}: ${valor}`)
      .join("\n");

    const templateParams = {
      name: tramite.solicitante || "No especificado",
      message: `
Nuevo trámite recibido:
Tipo de trámite: ${tramite.tipo || "No especificado"}
Estado: ${tramite.estado || "Pendiente"}
Fecha de solicitud: ${new Date().toLocaleDateString()}
Detalles:
${detalles}
      `.trim()
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log("Correo enviado exitosamente:", response.status);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
};