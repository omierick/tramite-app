// src/utils/pdfUtils.js
import html2pdf from "html2pdf.js";

export const generatePDF = (tramite) => {
  const element = document.createElement("div");

  let htmlContent = `
    <div style="font-family: Arial, sans-serif;">
      <h1 style="text-align:center; color: #2c3e50;">Trámite: ${
        tramite.tipo
      }</h1>
      <h3>Solicitante: ${
        tramite.campos["Nombre del solicitante"] || "No especificado"
      }</h3>
      <h4>Estado: ${tramite.estado}</h4>
      <hr style="margin: 20px 0;"/>
      <div style="margin-top:20px;">
        ${Object.entries(tramite.campos)
          .map(
            ([campo, valor]) => `
              <p><strong>${campo}:</strong> ${valor}</p>
            `
          )
          .join("")}
      </div>

      ${
        tramite.firma && tramite.firma.startsWith("data:image/") 
          ? `
          <div class="firma-preview" style="margin-top: 30px; text-align: center;">
            <p><strong>Firma del Solicitante:</strong></p>
            <div class="firma-box" style="display: inline-block; border: 1px dashed #ccc; padding: 10px; border-radius: 8px; margin-top: 10px;">
              <img src="${tramite.firma}" alt="Firma del solicitante" style="max-width: 100%; height: auto;" />
            </div>
          </div>
          `
          : ""
      }

      <p style="margin-top:30px; font-size:12px; color:#7f8c8d;">
        Fecha de creación: ${
          tramite.createdAt
            ? new Date(tramite.createdAt).toLocaleString()
            : "No disponible"
        }
      </p>
    </div>
  `;

  element.innerHTML = htmlContent;

  html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: `tramite_${tramite.tipo}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4" },
    })
    .save();
};