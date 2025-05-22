// src/utils/pdfUtils.js
import html2pdf from "html2pdf.js";

export const generatePDF = (tramite) => {
  const element = document.createElement("div");

  const fechaActual = new Date().toLocaleString();

  // 👇 Si tienes un logo base64 aquí ponlo
  const logoBase64 = ""; // ejemplo: "data:image/png;base64,iVBORw..."

  let htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <div style="text-align: center;">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Logo" style="max-height: 80px; margin-bottom: 10px;" />` : ""}
        <h1 style="color:#1f2937; margin-bottom: 5px;">Sistema de Trámites Digitales</h1>
        <p style="font-size: 14px; color:#6b7280;">Documento Validado de Trámite</p>
      </div>

      <hr style="margin: 20px 0;" />

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
        Documento generado electrónicamente. No requiere firma física.<br/>
        Generado el: ${fechaActual}
      </p>
    </div>
  `;

  element.innerHTML = htmlContent;

  const opt = {
    margin: 10,
    filename: `tramite_${tramite.tipo.replace(/\\s+/g, '_')}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4" },
  };

  html2pdf()
    .from(element)
    .set(opt)
    .toPdf()
    .get('pdf')
    .then((pdf) => {
      if (tramite.firma && tramite.firma.startsWith("data:image/")) {
        pdf.addPage();

        pdf.setFontSize(16);
        pdf.text("Firma del Solicitante", 105, 20, { align: "center" });

        const imgProps = pdf.getImageProperties(tramite.firma);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const maxWidth = 160;
        let imgWidth = Math.min(imgProps.width, maxWidth);
        let imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const x = (pageWidth - imgWidth) / 2;

        pdf.addImage(tramite.firma, "PNG", x, 30, imgWidth, imgHeight);
      }
    })
    .save();
};