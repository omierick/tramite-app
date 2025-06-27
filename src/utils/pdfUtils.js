import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoAyuntamiento from "../assets/logo-ayuntamiento.png";
import logoNR from "../assets/logo-nr2025.png";
import instruccionesImg from "../assets/Instrucciones.jpg";

export const generatePDF = (tramite) => {
  const doc = new jsPDF({ unit: "mm", format: [216, 330] }); // Tamaño oficio
  const campos = tramite.campos || {};
  const firma = tramite.firma;

    if (tramite.tipo === "Omiwave Desarrollo Humano") {

  const agregarEncabezado = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage(logoAyuntamiento, "PNG", 10, 8, 40, 20);
    doc.addImage(logoNR, "PNG", pageWidth - 50, 8, 40, 20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("OMIWAVE DESARROLLO HUMANO", pageWidth / 2, 32, { align: "center" });
  };

  const dibujarCheckbox = (x, y, label, checked) => {
    doc.setDrawColor(0);
    doc.rect(x, y, 4, 4);
    if (checked) doc.text("X", x + 1, y + 3.2);
    doc.text(label, x + 6, y + 3.2);
  };

  const checkFields = [
    "Alineamiento", "Cédula Informativa de Zonificación", "Prórroga de Licencia",
    "Ampliación de Construcción", "Obra Extemporánea", "Excavación o Relleno",
    "Incremento de Altura", "Suspensión de Obra", "Número Oficial",
    "Demolición Total o Parcial", "Muro de Contención", "Cambio de Uso de Suelo",
    "Modificación de Proyecto", "Término de Obra", "Obra Nueva",
    "Rotura de Pavimento", "Estructura para Anuncios", "Barda",
    "Marquesina", "Instalación de Antenas", "Radiotelecomunicaciones",
    "Incremento de Densidad"
  ];

  let y = 38;
  agregarEncabezado();
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TIPO DE TRÁMITE", 15, y);
  y += 5;

  const cols = [15, 85, 155];
  const rowHeight = 6;
  checkFields.forEach((field, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const value = !!campos[field] && campos[field] !== "false";
    dibujarCheckbox(cols[col], y + row * rowHeight, field, value);
  });

  y += Math.ceil(checkFields.length / 3) * rowHeight + 10;
  const crearTabla = (titulo, datos) => {
    autoTable(doc, {
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y,
      head: [[{ content: titulo, colSpan: 2, styles: { halign: 'center', fillColor: [0, 82, 204], textColor: 255 } }]],
      body: datos.map(([label, valor]) => [label, valor || ""]),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1.5 },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 100 } },
      margin: { left: 15, right: 15 }
    });
  };

  crearTabla("DATOS DEL INMUEBLE", [
    ["Propietario:", campos["Propietario"]],
    ["Representante Legal:", campos["Representante Legal"]],
    ["Calle:", campos["Calle"]],
    ["Número:", campos["Número"]],
    ["Manzana:", campos["Manzana"]],
    ["Lote:", campos["Lote"]],
    ["Colonia o Fraccionamiento:", campos["Pueblo, Colonia o Fraccionamiento"]],
    ["Clave Catastral:", campos["Clave Catastral"]],
    ["Superficie del Predio:", campos["Superficie del Predio"]],
    ["Superficie Construida:", campos["Superficie Construida"]],
    ["Superficie Prevista:", campos["Superficie Prevista"]],
    ["Uso del Suelo Actual:", campos["Uso del Suelo Actual"]],
    ["Uso del Suelo que se Pretende:", campos["Uso del Suelo que se Pretende"]]
  ]);

  crearTabla("DOMICILIO PARA RECIBIR NOTIFICACIONES EN NICOLÁS ROMERO", [
    ["Calle:", campos["Calle (Notificaciones)"]],
    ["Número:", campos["Número (Notificaciones)"]],
    ["Manzana:", campos["Manzana (Notificaciones)"]],
    ["Lote:", campos["Lote (Notificaciones)"]],
    ["Colonia:", campos["Colonia"]],
    ["Código Postal:", campos["Código Postal"]],
    ["Correo Electrónico:", campos["Correo Electrónico"]],
    ["Teléfono:", campos["Teléfono"]]
  ]);

  crearTabla("DATOS FISCALES", [
    ["Nombre o Razón Social:", campos["Nombre o Razón Social"]],
    ["RFC:", campos["RFC"]],
    ["Correo Fiscal:", campos["Correo Fiscal"]],
    ["Domicilio Fiscal:", campos["Domicilio Fiscal"]]
  ]);

  crearTabla("CROQUIS DE LOCALIZACIÓN", [
    ["Coordenadas UTM:", campos["Coordenadas UTM"]]
  ]);

  crearTabla("DATOS DEL DIRECTOR RESPONSABLE DE OBRA", [
    ["Nombre del D.R.O.:", campos["Nombre del D.R.O."]],
    ["Domicilio del D.R.O.:", campos["Domicilio del D.R.O."]],
    ["Registro del D.R.O.:", campos["Registro del D.R.O."]],
    ["Cédula Profesional:", campos["Cédula Profesional"]],
    ["Teléfono del D.R.O.:", campos["Teléfono del D.R.O."]]
  ]);

  crearTabla("FIRMAS", [
    ["Expediente:", campos["Expediente"]],
    ["Fecha:", campos["Fecha"]],
    ["Lugar:", campos["Lugar"]]
  ]);
  // === PÁGINA 1: Firmas finales ===
  // Aseguramos que haya espacio suficiente debajo de la tabla anterior
let firmaInicioY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 40 : y + 40;
const firmaAltura = 25;
const firmaAncho = 50;

if (firma) {
  doc.addImage(firma, "PNG", 15, firmaInicioY, 40, 20); // Firma a la izquierda
  firmaInicioY += 28; // Añadir espacio vertical tras la firma
}

// Dibujar líneas de firma y etiquetas más abajo
const firmas = [
  { x: 15, label: "FIRMA DEL SOLICITANTE" },
  { x: 83, label: "FIRMA DE QUIEN RECIBE EN VENTANILLA" },
  { x: 150, label: "FIRMA DEL D.R.O." }
];

firmas.forEach(({ x, label }) => {
  doc.line(x, firmaInicioY, x + firmaAncho, firmaInicioY); // Línea para firma
  doc.setFontSize(9);
  doc.text(label, x + firmaAncho / 2, firmaInicioY + 5, { align: "center" });
});


  // === PÁGINA 2: Imagen de instrucciones completa ===
  doc.addPage([216, 330]);
  doc.addImage(instruccionesImg, "JPEG", 0, 0, 216, 330);

  // === PÁGINA 3: Aviso de privacidad ===
  doc.addPage([216, 330]);

  const avisoX = 15;
  const avisoY = 30;
  const avisoW = 186;
  const avisoH = 100;

  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(avisoX, avisoY, avisoW, avisoH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("SEÑAL DE AVISO", avisoX + avisoW / 2, avisoY + 6, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const avisoTexto = `El ayuntamiento de Nicolás Romero es el responsable de la protección y tratamiento de los datos personales que usted proporcione en la Dirección de área de Desarrollo Urbano. Los datos recabados serán protegidos conforme a lo dispuesto a la Ley de Protección de datos personales en posesión de sujetos obligados del Estado de México y Municipios (LPDPPSOEMYM) y demás disposiciones aplicables. Sus datos personales serán usados con las siguientes finalidades: Dar trámite y seguimiento a las solicitudes que ingresan, tener control de los expedientes, para consulta y verificación de estatus, cuando proceda a expedir las licencias, autorizaciones, constancias, permisos o cédulas según la solicitud realizada por el contribuyente, realizar las notificaciones que correspondan y generar información estadística. Usted puede conocer el aviso de privacidad integral en las oficinas de la Dirección de Área de Desarrollo Urbano, en la Unidad de Transparencia Municipal y en la página web del Ayuntamiento.\n\nHe leído el aviso de privacidad integral y acepto los términos.`;

  const avisoLineas = doc.splitTextToSize(avisoTexto, avisoW - 10);
  doc.text(avisoLineas, avisoX + 5, avisoY + 12);

  const firmaAvisoY = avisoY + avisoH - 10;
  const firmaAvisoX1 = avisoX + 40;
  const firmaAvisoX2 = avisoX + avisoW - 40;
  doc.line(firmaAvisoX1, firmaAvisoY, firmaAvisoX2, firmaAvisoY);
  doc.setFontSize(8);
  doc.text("Nombre y firma", (firmaAvisoX1 + firmaAvisoX2) / 2, firmaAvisoY + 5, { align: "center" });

  // === Finalizar ===
  doc.save("Omiwave_Desarrollo_Humano.pdf");

 } else {
    import("html2pdf.js").then((html2pdf) => {
      const element = document.createElement("div");
      const fechaActual = new Date().toLocaleString();

      const camposHTML = Object.entries(campos)
        .map(
          ([campo, valor]) => `
            <tr><th>${campo}</th><td>${valor || "-"}</td></tr>
          `
        )
        .join("");

      const firmaHTML =
        firma && firma.startsWith("data:image/")
          ? `
        <div class="firma">
          <h2>Firma del Solicitante</h2>
          <img src="${firma}" alt="Firma" style="max-width: 300px; max-height: 150px;" />
        </div>`
          : "";

      const logoPath =
        tramite.logo_url?.trim()
          ? tramite.logo_url
          : new URL("../assets/logo3.png", import.meta.url).href;

      const htmlContent = `
        <style>
          html, body { margin: 0; padding: 0; font-family: Arial, sans-serif; color: #111; }
          #pdf-root { width: 794px; padding: 60px 40px; box-sizing: border-box; }
          .encabezado { text-align: center; margin-bottom: 20px; }
          .encabezado img { height: 80px; margin-bottom: 10px; }
          .encabezado h1 { margin: 0; font-size: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; page-break-inside: auto; }
          th, td { padding: 8px; border: 1px solid #ccc; vertical-align: top; }
          th { background-color: #f0f4f8; text-align: left; }
          h1, h2, h3 { margin: 10px 0; page-break-after: avoid; }
          .firma { text-align: center; margin-top: 50px; page-break-before: auto; }
          .footer { font-size: 12px; color: #6b7280; text-align: center; margin-top: 60px; }
          tr { break-inside: avoid; }
        </style>

        <div id="pdf-root">
          <div class="encabezado">
            <img src="${logoPath}" alt="Logo" />
          </div>
          <div style="text-align: center;">
            <h2>Sistema de Trámites Digitales</h2>
            <p style="font-size: 14px; color:#6b7280;">Documento Validado de Trámite</p>
          </div>

          <hr style="margin: 20px 0;" />

          <h3>Datos del Trámite</h3>
          <table>
            <tr><th>Folio</th><td>${tramite.folio || tramite.id || "-"}</td></tr>
            <tr><th>Nombre del Trámite</th><td>${tramite.nombre || "-"}</td></tr>
            <tr><th>Tipo</th><td>${tramite.tipo}</td></tr>
            <tr><th>Fecha de Solicitud</th><td>${tramite.createdAt ? new Date(tramite.createdAt).toLocaleDateString() : "-"}</td></tr>
            <tr><th>Fecha de Validación</th><td>${tramite.reviewedAt ? new Date(tramite.reviewedAt).toLocaleDateString() : "-"}</td></tr>
            <tr><th>Estado</th><td>${tramite.estado || "-"}</td></tr>
          </table>

          <h3>Solicitante</h3>
          <table>
            <tr><th>Nombre</th><td>${tramite.solicitante || "-"}</td></tr>
          </table>

          <h3>Campos adicionales</h3>
          <table>${camposHTML}</table>

          ${firmaHTML}

          <div class="footer">
            Documento generado electrónicamente. No requiere firma física.<br/>
            Generado el: ${fechaActual}
          </div>
        </div>
      `;

      element.innerHTML = htmlContent;

      const opt = {
        margin: 0,
        filename: `tramite_${tramite.tipo.replace(/\s+/g, "_")}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4" },
      };

      html2pdf.default().from(element).set(opt).save();
    });
  }
};