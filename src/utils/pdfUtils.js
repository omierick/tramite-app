// src/utils/pdfUtils.js
import html2pdf from "html2pdf.js";

import logo from "../assets/UR-003.jpg"; // Ajusta el path si tu archivo está en otra carpeta
export const generatePDF = (tramite) => {
  const element = document.createElement("div");
const backgroundBase64 = 'data:image/jpeg;base64,...'; // Coloca aquí tu imagen en base64
  const fechaActual = new Date().toLocaleString();

  // 👇 Si tienes un logo base64 aquí ponlo
  const logoBase64 = ""; // ejemplo: "data:image/png;base64,iVBORw..."
const fecha = new Date();
const dia = fecha.getDate();
const mes = fecha.toLocaleString("es-MX", { month: "long" });
const anio = fecha.getFullYear();

if (tramite.tipo === "Autorización de Lotificación") {


let htmlContent = `
  <head>
    <meta charset="UTF-8">
    <title>Características de un Plano - Proyecto de Lotificación</title>
    <style>
      .page {
        width: 816px;
        height: 1056px;
        font-family: Arial, sans-serif;
        color: #333;
        padding: 60px 40px;
        background-image: url('${logo}');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        box-sizing: border-box;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

 body {
 font-family: Arial, sans-serif;
 margin: 40px;
 line-height: 1.6;
 }
 .titulo {
 text-align: center;
 font-size: 20px;
 font-weight: bold;
 }
 .contenido {
 margin-top: 20px;
 }
 .item {
 margin-bottom: 10px;
 }
 .numero {
 font-weight: bold;
 }
 .texto {
 display: inline;
 }
.encabezado {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 20px 0;
  }

  .caja-izquierda {
    border: 2px solid black;
    padding: 20px;
    max-width: 60%;
  }

  .caja-izquierda p {
    margin: 4px 0;
  }

  .fecha-derecha {
    text-align: right;
    max-width: 35%;
  }
    </style>
  </head>
  <body>
    <div class="page">
  <br><br>
  <h2 style="color:#1f2937;">${tramite.tipo}</h2>
  <p>PARA SER LLENADO POR LA DEPENDENCIA OFICIAL</p>

  <div class="encabezado">
    <div class="fecha-derecha">
      <p><strong>Fecha:</strong> A ${dia} DE ${mes.toUpperCase()} DE ${anio}</p>
    </div>
    <div class="caja-izquierda">
      <p><strong>Folio:</strong> ${tramite.campos?.folio || '____________________'}</p>
      <p><strong>Oficio No.:</strong> ${tramite.campos?.oficio || '____________________'}</p>
      <p><strong>Exp. No.:</strong> ${tramite.campos?.expediente || '____________________'}</p>
    </div>
  </div>

  <div>
    <h3>DATOS GENERALES</h3>
    <p><strong>PROPIETARIO:</strong> ${tramite.campos?.propietario || '___________________________'} TELÉFONO: ${tramite.campos?.telPropietario || '__________'}</p>
    <p><strong>NOMBRE DEL PDRO.:</strong> ${tramite.campos?.nombrePdro || '________________'} No. PDRO: ${tramite.campos?.numPdro || '______'} TELÉFONO: ${tramite.campos?.telPdro || '______'}</p>
    <p><strong>UBICACIÓN:</strong> ${tramite.campos?.ubicacion || '__________________'} LOTE: ${tramite.campos?.lote || '____'} MANZ.: ${tramite.campos?.manzana || '____'} SEC/SMZ: ${tramite.campos?.seccion || '______'}</p>
    <p><strong>DOMICILIO DE NOTIFICACIÓN:</strong> ${tramite.campos?.domicilio || '________________________________________'}</p>

    <h3 style="margin-top:20px;">COSTO DE LA LOTIFICACIÓN (LEY DE INGRESOS 2023)</h3>
    <table style="width:100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="border: 1px solid #ccc; padding: 6px;">Tipo</th>
          <th style="border: 1px solid #ccc; padding: 6px;">Costo por m²</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="border:1px solid #ccc; padding:6px;">Popular</td><td style="border:1px solid #ccc; padding:6px;">$171.00</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Interés Social</td><td style="border:1px solid #ccc; padding:6px;">$179.00</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Interés Medio</td><td style="border:1px solid #ccc; padding:6px;">$359.00</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Residencial</td><td style="border:1px solid #ccc; padding:6px;">$509.00</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Campestre</td><td style="border:1px solid #ccc; padding:6px;">$509.00</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Comercial</td><td style="border:1px solid #ccc; padding:6px;">$471.00</td></tr>
        <tr><td style="border:1px solid #ccc; padding:6px;">Industrial</td><td style="border:1px solid #ccc; padding:6px;">$275.00</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:20px;">REQUISITOS</h3>
    <ol style="font-size:14px; padding-left: 20px;">
      <li>Original y copia de la solicitud con firmas autógrafas.</li>
      <li>4 planos del proyecto firmados por propietario y director responsable.</li>
      <li>Factibilidad vigente de SIMAS o ratificación de CEAS.</li>
      <li>Copia de factibilidad de CFE.</li>
      <li>CD con proyecto AutoCAD 2014 con coordenadas UTM.</li>
      <li>Plano topográfico.</li>
      <li>Identificación oficial del propietario.</li>
      <li>Identificación oficial del PDRO.</li>
    </ol>
  </div>
</div>


    <div class="page">
      <h1>Página 2</h1>
      <p>Contenido de la segunda página...</p>
    </div>
    <div class="page">
      <h1>Página 3</h1>
      <p>Contenido de la tercera página...</p>
    </div>
    <div class="page">
      <h1>Página 4</h1>
      <p>Contenido de la cuarta página...</p>
    </div>
    <div class="page">
      <h1>Página 5</h1>
      <p>Contenido de la quinta página...</p>
    </div>
  </body>
`;

element.innerHTML = htmlContent;

const opt = {
  margin: 0,
  filename: `tramite_${tramite.tipo.replace(/\s+/g, '_')}.pdf`,
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
      const imgWidth = Math.min(imgProps.width, maxWidth);
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      const x = (pageWidth - imgWidth) / 2;

      pdf.addImage(tramite.firma, "PNG", x, 30, imgWidth, imgHeight);
    }
  })
  .save();

  }else{
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
  }
  
};