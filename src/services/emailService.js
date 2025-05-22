
import emailjs from "@emailjs/browser";

const EMAIL_SERVICE_ID = "service_6ti57qy";
const EMAIL_TEMPLATE_ID = "template_t5o2ki8";
const EMAIL_USER_ID = "SUpfpJKE0aL-57jn0"; // Tu Public Key de EmailJS

export const sendTramiteEmail = async (tramite) => {
  try {
    console.log("📨 Enviando correo a:", tramite.email);

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        name: tramite.solicitante || "Usuario",
        email: tramite.email,
        estado: tramite.estado || "Pendiente",
        message: `El estado de tu trámite ha cambiado a: ${tramite.estado || "Pendiente"}`,
      },
      EMAIL_USER_ID
    );

    console.log("✅ Email enviado:", response.status, response.text);
    return response;
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    throw error;
  }
};
