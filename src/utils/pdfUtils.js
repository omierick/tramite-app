import jsPDF from "jspdf";
import fondoImagen from "../assets/UR-003-AUTORIZACIÓN-DE-LOTIFICACIÓN.jpg";

// Función principal para generar PDF de cualquier tipo de trámite
export const generatePDF = (tramite) => {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const campos = tramite.campos || {};
  const now = new Date();
  let y = 50;

  // Utilidad para agregar el fondo
  const agregarFondo = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(fondoImagen, "JPEG", 0, 0, pageWidth, pageHeight);
  };

  // Utilidad para nueva página
  const nuevaPagina = () => {
    doc.addPage("letter", "portrait");
    doc.setFontSize(9);
    doc.setTextColor(0);
    agregarFondo();
    return 60;
  };

  // Utilidad para controlar salto de línea vertical
  const salto = (altura = 5) => {
    if (y + altura > 265) y = nuevaPagina();
    else y += altura;
  };

  // === AUTORIZACIÓN DE LOTIFICACIÓN ===
  if (tramite.tipo === "Autorización de Lotificación") {
    const {
      Propietario: propietario = "",
      Teléfono: telefonoPropietario = "",
      "Nombre del PDRO": nombrePDRO = "",
      "Número de PDRO": noPDRO = "",
      "Teléfono PDRO": telefonoPDRO = "",
      Ubicación: ubicacion = "",
      "Número de Lote": lote = "",
      Manzana: manz = "",
      "Sección o Super Manzana": secsmz = "",
      "Domicilio de Notificación": domicilio = "",
      dia = now.getDate(),
      mes = now.toLocaleString("es-MX", { month: "long" }),
      anio = now.getFullYear(),
      lugar = "Torreón",
    } = campos;

    const firma = tramite.firma;
    agregarFondo();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AUTORIZACIÓN DE LOTIFICACIÓN", 105, y, { align: "center" });
    salto(10);

    // FOLIO DINÁMICO
    doc.setFontSize(12);
    doc.setFont("helvetica", "");
    doc.text(`Folio: ${tramite.folio || tramite.id || "No asignado"}`, 105, y, { align: "center" });
    salto(8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("FECHA Y LUGAR", 15, y);
    doc.setFont("helvetica", "");
    doc.rect(15, y + 2, 180, 8);
    doc.text(`Lugar: ${lugar}    Día: ${dia}    Mes: ${mes}    Año: ${anio}`, 20, y + 8);
    salto(14);

    doc.setFont("helvetica", "bold");
    doc.text("DATOS GENERALES", 15, y);
    salto(6);
    doc.setFont("helvetica", "");

    const drawCampo = (x, w, label, valor) => {
      doc.rect(x, y, w, 8);
      doc.text(`${label}: ${valor}`, x + 2, y + 5);
    };

    drawCampo(15, 100, "Propietario", propietario);
    drawCampo(115, 80, "Teléfono", telefonoPropietario);
    salto(9);

    drawCampo(15, 80, "Nombre PDRO", nombrePDRO);
    drawCampo(95, 50, "No. PDRO", noPDRO);
    drawCampo(145, 50, "Teléfono", telefonoPDRO);
    salto(9);

    drawCampo(15, 100, "Ubicación", ubicacion);
    drawCampo(115, 25, "Lote", lote);
    drawCampo(140, 30, "Manz.", manz);
    drawCampo(170, 25, "Sec/Smz", secsmz);
    salto(9);

    drawCampo(15, 180, "Domicilio de Notificación", domicilio);
    salto(14);

    // Puedes seguir con el resto del contenido...

    doc.save("Autorizacion_Lotificacion.pdf");
    return;
  }

  // === DICTAMEN DE ALINEAMIENTO VIAL ===
  else if (tramite.tipo === "Dictamen de Alineamiento Vial") {
    const propietario = campos["Propietario"] || "";
    const telefono = campos["Teléfono"] || "";
    const ubicacion = campos["Ubicación"] || "";
    const lote = campos["Número de Lote"] || "";
    const manzana = campos["Manzana"] || "";
    const secsmz = campos["Sección o Super Manzana"] || "";
    const domicilio = campos["Domicilio de Notificación"] || "";
    const claveCatastral = campos["Clave Catastral"] || "";
    const entreCalles = campos["Entre Calles"] || "";
    const descripcion = campos["Descripción del Trámite"] || "";
    const firmaPropietario = campos["Firma del Propietario"] || null;
    const firmaSolicitante = tramite.firma || null;
    const dia = campos.dia || now.getDate();
    const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
    const anio = campos.anio || now.getFullYear();
    const lugar = campos.lugar || "Torreón";

    agregarFondo();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DICTAMEN DE ALINEAMIENTO VIAL", 105, y, { align: "center" });
    salto(10);

    // FOLIO DINÁMICO
    doc.setFontSize(12);
    doc.setFont("helvetica", "");
    doc.text(`Folio: ${tramite.folio || tramite.id || "No asignado"}`, 105, y, { align: "center" });
    salto(8);

    // ... continúa tu lógica, igual que antes
    doc.save("Dictamen_Alineamiento_Vial.pdf");
    return;
  }

  // === TRÁMITE DEL ELDER ===
  else if (tramite.tipo === "tramite del elder") {
    const edad = campos["edad"] || "";
    const firma = tramite.firma;
    const dia = campos.dia || now.getDate();
    const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
    const anio = campos.anio || now.getFullYear();
    const lugar = campos.lugar || "Torreón";

    agregarFondo();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TRÁMITE DEL ELDER", 105, y, { align: "center" });
    salto(10);

    // FOLIO DINÁMICO
    doc.setFontSize(12);
    doc.setFont("helvetica", "");
    doc.text(`Folio: ${tramite.folio || tramite.id || "No asignado"}`, 105, y, { align: "center" });
    salto(8);

    // ... continúa tu lógica, igual que antes
    doc.save("Tramite_Del_Elder.pdf");
    return;
  }

  // === TRÁMITE DE PRUEBA ===
  else if (tramite.tipo === "Tramiteprueba") {
    const nombre = campos["Nombre"] || "";
    const direccion = campos["Dirección"] || "";
    const telefono = campos["telefono"] || "";
    const cp = campos["CP"] || "";
    const firma = tramite.firma;
    const dia = campos.dia || now.getDate();
    const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
    const anio = campos.anio || now.getFullYear();
    const lugar = campos.lugar || "Torreón";

    agregarFondo();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TRÁMITE DE PRUEBA", 105, y, { align: "center" });
    salto(10);

    // FOLIO DINÁMICO
    doc.setFontSize(12);
    doc.setFont("helvetica", "");
    doc.text(`Folio: ${tramite.folio || tramite.id || "No asignado"}`, 105, y, { align: "center" });
    salto(8);

    // ... continúa tu lógica, igual que antes
    doc.save("Tramite_Prueba.pdf");
    return;
  }

  // === LICENCIA DE CONDUCIR ===
  else if (tramite.tipo === "Licencia de Conducir") {
    const nombre = campos["Nombre"] || "";
    const direccion = campos["Dirección"] || "";
    const edad = campos["Edad"] || "";
    const tipoLicencia = campos["Tipo de Licencia"] || "";
    const vigencia = campos["Vigencia"] || "";
    const telefono = campos["Teléfono"] || "";
    const firma = tramite.firma;
    const dia = campos.dia || now.getDate();
    const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
    const anio = campos.anio || now.getFullYear();
    const lugar = campos.lugar || "Torreón";

    agregarFondo();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SOLICITUD DE LICENCIA DE CONDUCIR", 105, y, { align: "center" });
    salto(10);

    // FOLIO DINÁMICO
    doc.setFontSize(12);
    doc.setFont("helvetica", "");
    doc.text(`Folio: ${tramite.folio || tramite.id || "No asignado"}`, 105, y, { align: "center" });
    salto(8);

    // ... continúa tu lógica, igual que antes
    doc.save("Licencia_Conducir.pdf");
    return;
  }

  // === CUALQUIER OTRO TRÁMITE (usa html2pdf.js) ===
  else {
    import("html2pdf.js").then((html2pdf) => {
      const element = document.createElement("div");
      const fechaActual = new Date().toLocaleString();
      const logoPath = "src/assets/logo3.png";
      const camposHTML = Object.entries(tramite.campos || {})
        .map(([campo, valor]) => `
          <tr>
            <th>${campo}</th>
            <td>${valor || '-'}</td>
          </tr>
        `).join('');

      const firmaHTML = tramite.firma && tramite.firma.startsWith("data:image/")
        ? `
          <div class="firma">
            <h2>Firma del Solicitante</h2>
            <img src="${tramite.firma}" alt="Firma" style="max-width: 300px; max-height: 150px;" />
          </div>
        `
        : "";

      // Incluye el folio en la tabla principal:
      const htmlContent = `
        <style>
          /* Tus estilos aquí... */
        </style>
        <div id="pdf-root">
          <div class="encabezado">
            <img src="${logoPath}" alt="Logo Gobierno Omiwave" />
            <h1>Gobierno Omiwave</h1>
          </div>
          <div style="text-align: center;">
            <h2>Sistema de Trámites Digitales</h2>
            <p style="font-size: 14px; color:#6b7280;">Documento Validado de Trámite</p>
          </div>
          <hr style="margin: 20px 0;" />
          <h3>Datos del Trámite</h3>
          <table>
            <tr><th>Tipo</th><td>${tramite.tipo}</td></tr>
            <tr><th>Folio</th><td>${tramite.folio || tramite.id || "-"}</td></tr>
            <tr><th>Fecha de Solicitud</th><td>${tramite.createdAt ? new Date(tramite.createdAt).toLocaleDateString() : '-'}</td></tr>
            <tr><th>Fecha de Validación</th><td>${tramite.reviewedAt ? new Date(tramite.reviewedAt).toLocaleDateString() : '-'}</td></tr>
            <tr><th>Estado</th><td>${tramite.estado || "-"}</td></tr>
          </table>
          <h3>Solicitante</h3>
          <table>
            <tr><th>Nombre</th><td>${tramite.solicitante || '-'}</td></tr>
          </table>
          <h3>Campos adicionales</h3>
          <table>
            ${camposHTML}
          </table>
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
        filename: `tramite_${tramite.tipo.replace(/\s+/g, '_')}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4" },
      };

      html2pdf.default()
        .from(element)
        .set(opt)
        .save();
    });
  }
};