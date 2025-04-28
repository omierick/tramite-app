import emailjs from "@emailjs/browser";

export const sendTramiteEmail = async (tramite) => {
  try {
    const serviceId = "service_6ti57qy"; 
    const templateId = "template_t5o2ki8"; 
    const publicKey = "SUpfpJKE0aL-57jn0"; 

    const detalles = Object.entries(tramite.campos || {})
      .map(([campo, valor]) => `- ${campo}: ${valor}`)
      .join("\n");

    const templateParams = {
      name: tramite.solicitante || "No especificado",
      message: `
Nuevo trámite recibido:
Tipo: ${tramite.tipo || "No especificado"}
Estado: ${tramite.estado || "Pendiente"}
Fecha: ${new Date().toLocaleDateString()}
Detalles:
${detalles}
`.trim()
    };

    await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log("✅ Correo enviado correctamente");
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
};