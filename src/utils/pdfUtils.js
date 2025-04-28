// src/utils/pdfUtils.js
import html2pdf from "html2pdf.js";

export const generatePDF = (tramite) => {
  const element = document.createElement("div");

  const fechaActual = new Date().toLocaleString();

  let htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="text-align:center; color:#1f2937;">Municipalidad de Ejemplo</h1>
      <p style="text-align:center; color:#6b7280;">Documento Validado de Trámite</p>

      <hr style="margin: 20px 0;"/>

      <h3 style="margin-bottom:10px;">Datos del Trámite</h3>
      <table style="width:100%; border-collapse: collapse;">
        <tr style="background-color:#f0f4f8;">
          <th style="padding:8px; border:1px solid #ccc; text-align:left;">Tipo de Trámite</th>
          <td style="padding:8px; border:1px solid #ccc;">${tramite.tipo}</td>
        </tr>
        <tr>
          <th style="padding:8px; border:1px solid #ccc; text-align:left;">Fecha de Solicitud</th>
          <td style="padding:8px; border:1px solid #ccc;">${tramite.createdAt ? new Date(tramite.createdAt).toLocaleDateString() : '-'}</td>
        </tr>
        <tr>
          <th style="padding:8px; border:1px solid #ccc; text-align:left;">Fecha de Validación</th>
          <td style="padding:8px; border:1px solid #ccc;">${tramite.reviewedAt ? new Date(tramite.reviewedAt).toLocaleDateString() : '-'}</td>
        </tr>
        <tr>
          <th style="padding:8px; border:1px solid #ccc; text-align:left;">Estado</th>
          <td style="padding:8px; border:1px solid #ccc;">${tramite.estado}</td>
        </tr>
      </table>

      <h3 style="margin:20px 0 10px;">Datos del Solicitante</h3>
      <table style="width:100%; border-collapse: collapse;">
        <tr style="background-color:#f0f4f8;">
          <th style="padding:8px; border:1px solid #ccc; text-align:left;">Nombre Completo</th>
          <td style="padding:8px; border:1px solid #ccc;">${tramite.solicitante || '-'}</td>
        </tr>
        <tr>
          <th style="padding:8px; border:1px solid #ccc; text-align:left;">Documento de Identidad</th>
          <td style="padding:8px; border:1px solid #ccc;">-</td>
        </tr>
        <tr>
          <th style="padding:8px; border:1px solid #ccc; text-align:left;">Dirección</th>
          <td style="padding:8px; border:1px solid #ccc;">-</td>
        </tr>
      </table>

      <h3 style="margin:20px 0 10px;">Datos Adicionales</h3>
      <table style="width:100%; border-collapse: collapse;">
        ${Object.entries(tramite.campos || {}).map(([campo, valor]) => `
          <tr>
            <th style="padding:8px; border:1px solid #ccc; text-align:left; background-color:#f0f4f8;">${campo}</th>
            <td style="padding:8px; border:1px solid #ccc;">${valor || '-'}</td>
          </tr>
        `).join('')}
      </table>

      <p style="margin-top:30px; font-size:12px; color:#6b7280; text-align:center;">
        Documento generado el: ${fechaActual}
      </p>
    </div>
  `;

  element.innerHTML = htmlContent;

  html2pdf()
    .from(element)
    .set({
      margin: 10,
      filename: `tramite_${tramite.tipo.replace(/\s+/g,'_')}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4" },
    })
    .save();
};
