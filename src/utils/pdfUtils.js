import jsPDF from "jspdf";
import fondoImagen from "../assets/UR-003-AUTORIZACIÓN-DE-LOTIFICACIÓN.jpg";

export const generatePDF = (tramite) => {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const campos = tramite.campos || {};
  const now = new Date();

  const agregarFondo = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(fondoImagen, "JPEG", 0, 0, pageWidth, pageHeight);
  };

  const nuevaPagina = () => {
    doc.addPage("letter", "portrait");
    doc.setFontSize(9);
    doc.setTextColor(0);
    agregarFondo();
    return 60;
  };

  let y = 50;
  agregarFondo();

  const salto = (altura = 5) => {
    if (y + altura > 265) y = nuevaPagina();
    else y += altura;
  };

  if (tramite.tipo === "Autorización de Lotificación") {
    const {
      "Propietario": propietario = "",
      "Teléfono": telefonoPropietario = "",
      "Nombre del PDRO": nombrePDRO = "",
      "Número de PDRO": noPDRO = "",
      "Teléfono PDRO": telefonoPDRO = "",
      "Ubicación": ubicacion = "",
      "Número de Lote": lote = "",
      "Manzana": manz = "",
      "Sección o Super Manzana": secsmz = "",
      "Domicilio de Notificación": domicilio = "",
      dia = now.getDate(),
      mes = now.toLocaleString("es-MX", { month: "long" }),
      anio = now.getFullYear(),
      lugar = "Torreón"
    } = campos;

    const firma = tramite.firma;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AUTORIZACIÓN DE LOTIFICACIÓN", 105, y, { align: "center" });
    salto(10);

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

    doc.setFont("helvetica", "bold");
    doc.text("REQUISITOS", 15, y);
    salto(6);
    doc.setFont("helvetica", "");

    const requisitos = [
      "1.- Original y copia de la solicitud de la ventanilla con firmas autógrafas.",
      "2.- 4 planos del proyecto de lotificación con firma autógrafa del propietario y del director responsable de obra, con las características correspondientes.",
      "3.- Factibilidad vigente de servicios expedidos por el sistema municipal de aguas y saneamientos de Torreón, Coahuila, con excepción de predios para vivienda plurifamiliar en fraccionamientos autorizados no municipalizados. En caso de que la factibilidad sea expedida por el sistema estatal del aguas y saneamiento (CEAS), este deberá ser ratificado por el sistema de agua de Torreón, Coahuila (SIMAS).",
      "4.- Copia simple del recibo de CFE (electrificación).",
      "5.- CD con el proyecto de lotificación en programa AutoCAD 2014 con cuadro de construcción con coordenadas UTM.",
      "6.- Plano Topográfico.",
      "7.- Copia de identificación oficial del propietario.",
      "8.- Copia de identificación oficial del Perito Director Responsable de Obra."
    ];

    requisitos.forEach((line) => {
      const splitted = doc.splitTextToSize(line, 180);
      if (y + splitted.length * 4.5 > 265) y = nuevaPagina();
      doc.text(splitted, 15, y);
      y += splitted.length * 4.5;
    });

    doc.setFont("helvetica", "bold");
doc.setFontSize(8);
doc.text("COSTO DE LA LOTIFICACIÓN CON BASE AL NUMERAL 2 DEL ARTÍCULO 37 DE LA LEY DE INGRESOS 2023", 15, y);
salto(5);
doc.setFont("helvetica", "");

const tipos = [
  ["Popular", "$ 171.00 M2"],
  ["Interés Social", "$ 179.00 M2"],
  ["Interés Medio", "$ 389.00 M2"],
  ["Residencial", "$ 509.00 M2"],
  ["Campestre", "$ 509.00 M2"],
  ["Comercial", "$ 471.00 M2"],
  ["Industrial", "$ 275.00 M2"]
];

// Cabecera
doc.setFont("helvetica", "bold");
const col1X = 20;
const col2X = 105;
const rowHeight = 5;

doc.rect(col1X, y, 85, rowHeight);
doc.text("TIPO DE LOTIFICACIÓN", col1X + 2, y + 3.5);
doc.rect(col2X, y, 50, rowHeight);
doc.text("COSTO POR M2", col2X + 2, y + 3.5);
salto(rowHeight);

// Contenido
doc.setFont("helvetica", "");
tipos.forEach((tipo) => {
  doc.rect(col1X, y, 85, rowHeight);
  doc.text(tipo[0], col1X + 2, y + 3.5);
  doc.rect(col2X, y, 50, rowHeight);
  doc.text(tipo[1], col2X + 2, y + 3.5);
  salto(rowHeight);
});


    // === FIRMAS EN LA HOJA 1 ===
    salto(5);
    if (y + 35 > 265) y = nuevaPagina();

    doc.setFontSize(9);
    doc.text("EL/LA QUE SUSCRIBE BAJO PROTESTA DE DECIR VERDAD, MANIFIESTO QUE LOS DATOS AQUÍ PROPORCIONADOS, SON VERDADEROS...", 15, y, { maxWidth: 180 });
    salto(10);

    doc.text("NOMBRE Y FIRMA DEL PROPIETARIO", 20, y + 25);
    doc.text("NOMBRE Y FIRMA DEL PDRO. NO.", 120, y + 25);
    doc.line(20, y + 20, 80, y + 20);
    doc.line(120, y + 20, 180, y + 20);

    if (firma) {
      doc.addImage(firma, "PNG", 20, y, 40, 15);
    }

    y = nuevaPagina();

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.text("CARACTERÍSTICAS QUE DEBERÁ TENER UN PLANO\nPROYECTO DE LOTIFICACIÓN", 105, y, { align: "center" });
salto(12);

doc.setFontSize(9);
doc.setFont("helvetica", "");

const caracteristicas = [
  "1.- LOTIFICACIÓN: INDICAR LA NUMERACIÓN DE CADA MANZANA Y DE CADA UNO DE LOS LOTES,",
  "    INCLUYENDO ESTOS SUS MEDIDAS; SUPERFICIES Y MEDIDAS DE LAS ÁREAS DE DONACIÓN; (CESIÓN)...",
  "2.- POLÍGONO DEL TERRENO A FRACCIONAR SEGÚN ESCRITURAS Y/O APEO...",
  "3.- CURVAS Y COTAS DE NIVEL DEL TERRENO CON REFERENCIA AL NIVEL DEL MAR.",
  "4.- SI EL POLÍGONO A FRACCIONAR ES PORCIÓN DE UN TERRENO DE MAYOR EXTENSIÓN...",
  "5.- SI EL TERRENO A FRACCIONAR SE COMPONE DE DOS O MÁS PREDIOS...",
  "6.- TRAZA URBANA CIRCUNDANTE CON SUS RESPECTIVOS ACCESOS AL PREDIO...",
  "7.- EN CASO DE EXISTIR EN EL PREDIO O EN SUS LINDEROS INSTALACIONES DE LA COMISIÓN FEDERAL DE...",
  "8.- SECCIONES TRANSVERSALES DE LAS CALLES TIPO EN LAS QUE EL ARROYO DEBERÁ SER MÚLTIPLO DE...",
  "9.- CROQUIS DE LOCALIZACIÓN CON REFERENCIA Y DISTANCIAS PRECISAS...",
  "10.- CUADRO DE DISTRIBUCIÓN DE ÁREAS CONTENIENDO: ÁREA TOTAL, ÁREA VENDIBLE, ÁREA VIAL Y ÁREA DE DONACIÓN...",
  "11.- NOMBRES PROPUESTOS A LAS CALLES."
];

caracteristicas.forEach((line) => {
  const splitted = doc.splitTextToSize(line, 180); // Ajusta al ancho útil
  const alturaBloque = splitted.length * 4.5;

  if (y + alturaBloque > 265) y = nuevaPagina();

  doc.text(splitted, 15, y);
  y += alturaBloque;
});

    y = nuevaPagina();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AVISO DE PRIVACIDAD PARA EL TRÁMITE DE AUTORIZACIÓN DE LOTIFICACIÓN", 105, y, { align: "center" });
    salto(12);

    doc.setFontSize(10);
    doc.setFont("helvetica", "");

    const aviso = [
      "La Dirección General de Ordenamiento Territorial y Urbanismo del R. Ayuntamiento de Torreón...",
      "La información aquí descrita es en cumplimiento del artículo 21 y 22, de la Ley de Protección de Datos...",
      "Teléfono del Propietario. Ubicación. Domicilio de Notificación. Credencial de Elector.",
      "Los datos personales recabados tienen como finalidad:...",
      "Para Uso y Trámite de Autorización de Lotificación.\nPara Actualización de los Sistemas Municipales y Término del Trámite",
      "Así mismo se informa, que la información relacionada en este trámite de autorización...",
      "Derechos ARCO...",
      "Este Aviso de Privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas..."
    ];

    aviso.forEach((line) => {
      doc.text(line, 15, y, { maxWidth: 180 });
      salto(10);
    });

const pageWidth = doc.internal.pageSize.getWidth();

// Parámetros
const firmaWidth = 40;
const firmaHeight = 15;
const firmaX = (pageWidth - firmaWidth) / 2;
const firmaY = 230; // posición de la firma

// Línea más arriba
const lineaWidth = 60;
const lineaX = (pageWidth - lineaWidth) / 2;
const lineaY = 242;

// Línea delgada centrada (grosor igual a las otras firmas)
doc.setLineWidth(0.2); // grosor uniforme con otras firmas
doc.line(lineaX, lineaY, lineaX + lineaWidth, lineaY);

// Texto centrado
doc.setFont("helvetica", "bold");
doc.text("NOMBRE Y FIRMA DEL SOLICITANTE", pageWidth / 2, 250, { align: "center" });

// Firma centrada
if (firma) {
  doc.addImage(firma, "PNG", firmaX, firmaY, firmaWidth, firmaHeight);
}

    doc.save("Autorizacion_Lotificacion.pdf");
  }

  // ========== DICTAMEN DE ALINEAMIENTO VIAL ==========
  else if (tramite.tipo === "Dictamen de Alineamiento Vial") {
    
  try {
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
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("DICTAMEN DE ALINEAMIENTO VIAL", 105, y, { align: "center" });
    salto(10);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("FECHA Y LUGAR", 15, y);
    doc.setFont("helvetica", "");
    doc.rect(15, y + 2, 180, 8);
    doc.text(`Lugar: ${lugar}    Día: ${dia}    Mes: ${mes}    Año: ${anio}`, 20, y + 8);
    salto(14);

    doc.setFont("helvetica", "bold");
    doc.text("DATOS GENERALES", 15, y);
    salto(6);
    doc.setFont("helvetica", "");
    doc.setFontSize(10);

    doc.rect(15, y, 100, 8);
    doc.text(`Propietario: ${propietario}`, 17, y + 5);
    doc.rect(115, y, 80, 8);
    doc.text(`Teléfono: ${telefono}`, 117, y + 5);
    salto(9);

    doc.rect(15, y, 100, 8);
    doc.text(`Ubicación: ${ubicacion}`, 17, y + 5);
    doc.rect(115, y, 25, 8);
    doc.text(`Lote: ${lote}`, 117, y + 5);
    doc.rect(140, y, 30, 8);
    doc.text(`Manzana: ${manzana}`, 142, y + 5);
    doc.rect(170, y, 25, 8);
    doc.text(`Sec/Smz: ${secsmz}`, 172, y + 5);
    salto(9);

    doc.rect(15, y, 100, 8);
    doc.text(`Clave Catastral: ${claveCatastral}`, 17, y + 5);
    doc.rect(115, y, 80, 8);
    doc.text(`Entre Calles: ${entreCalles}`, 117, y + 5);
    salto(9);

    doc.rect(15, y, 180, 8);
    doc.text(`Domicilio de Notificación: ${domicilio}`, 17, y + 5);
    salto(12);

    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPCIÓN DEL TRÁMITE", 15, y);
    salto(6);
    doc.setFont("helvetica", "");
    doc.rect(15, y, 180, 12);
    doc.text(`${descripcion}`, 17, y + 8, { maxWidth: 176 });
    salto(16);

    doc.setFont("helvetica", "bold");
    doc.text("FIRMAS", 15, y);
    salto(6);

    doc.setFont("helvetica", "");
    doc.text("Propietario:", 20, y);
    doc.text("Solicitante:", 120, y);
    salto(20);

    // Quita temporalmente las firmas para ver si descarga
    // if (firmaPropietario) {
    //   doc.addImage(firmaPropietario, "PNG", 20, y - 20, 40, 15);
    // }
    // if (firmaSolicitante) {
    //   doc.addImage(firmaSolicitante, "PNG", 120, y - 20, 40, 15);
    // }

    doc.save("Dictamen_Alineamiento_Vial.pdf");
  } catch (error) {
    alert("Error generando el PDF: " + error.message);
    console.error(error);
  }
}
else if (tramite.tipo === "tramite del elder") {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const campos = tramite.campos || {};
  const edad = campos["edad"] || "";
  const firma = tramite.firma;
  const now = new Date();
  const dia = campos.dia || now.getDate();
  const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
  const anio = campos.anio || now.getFullYear();
  const lugar = campos.lugar || "Torreón";

  let y = 50;

  const agregarFondo = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(fondoImagen, "JPEG", 0, 0, pageWidth, pageHeight);
  };

  const salto = (altura = 5) => {
    if (y + altura > 265) {
      doc.addPage("letter", "portrait");
      agregarFondo();
      y = 60;
    } else {
      y += altura;
    }
  };

  agregarFondo();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TRÁMITE DEL ELDER", 105, y, { align: "center" });
  salto(10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA Y LUGAR", 15, y);
  doc.setFont("helvetica", "");
  doc.rect(15, y + 2, 180, 8);
  doc.text(`Lugar: ${lugar}    Día: ${dia}    Mes: ${mes}    Año: ${anio}`, 20, y + 8);
  salto(14);

  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL SOLICITANTE", 15, y);
  salto(6);
  doc.setFont("helvetica", "");

  doc.rect(15, y, 180, 8);
  doc.text(`Edad del solicitante: ${edad}`, 17, y + 5);
  salto(14);

  doc.setFont("helvetica", "bold");
  doc.text("FIRMA DEL SOLICITANTE", 15, y);
  salto(20);

  if (firma) {
    doc.addImage(firma, "PNG", 20, y, 50, 20);
    salto(25);
  }

  doc.save("Tramite_Del_Elder.pdf");
}
else if (tramite.tipo === "Tramiteprueba") {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const campos = tramite.campos || {};
  const nombre = campos["Nombre"] || "";
  const direccion = campos["Dirección"] || "";
  const telefono = campos["telefono"] || "";
  const cp = campos["CP"] || "";
  const firma = tramite.firma;
  const now = new Date();
  const dia = campos.dia || now.getDate();
  const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
  const anio = campos.anio || now.getFullYear();
  const lugar = campos.lugar || "Torreón";

  let y = 50;

  const agregarFondo = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(fondoImagen, "JPEG", 0, 0, pageWidth, pageHeight);
  };

  const salto = (altura = 5) => {
    if (y + altura > 265) {
      doc.addPage("letter", "portrait");
      agregarFondo();
      y = 60;
    } else {
      y += altura;
    }
  };

  agregarFondo();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TRÁMITE DE PRUEBA", 105, y, { align: "center" });
  salto(10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA Y LUGAR", 15, y);
  doc.setFont("helvetica", "");
  doc.rect(15, y + 2, 180, 8);
  doc.text(`Lugar: ${lugar}    Día: ${dia}    Mes: ${mes}    Año: ${anio}`, 20, y + 8);
  salto(14);

  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL SOLICITANTE", 15, y);
  salto(6);
  doc.setFont("helvetica", "");

  doc.rect(15, y, 180, 8);
  doc.text(`Nombre: ${nombre}`, 17, y + 5);
  salto(9);

  doc.rect(15, y, 180, 8);
  doc.text(`Dirección: ${direccion}`, 17, y + 5);
  salto(9);

  doc.rect(15, y, 90, 8);
  doc.text(`Teléfono: ${telefono}`, 17, y + 5);
  doc.rect(105, y, 90, 8);
  doc.text(`CP: ${cp}`, 107, y + 5);
  salto(14);

  doc.setFont("helvetica", "bold");
  doc.text("FIRMA DEL SOLICITANTE", 15, y);
  salto(20);

  if (firma) {
    doc.addImage(firma, "PNG", 20, y, 50, 20);
    salto(25);
  }

  doc.save("Tramite_Prueba.pdf");
}else if (tramite.tipo === "Licencia de Conducir") {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const campos = tramite.campos || {};

  const nombre = campos["Nombre"] || "";
  const direccion = campos["Dirección"] || "";
  const edad = campos["Edad"] || "";
  const tipoLicencia = campos["Tipo de Licencia"] || "";
  const vigencia = campos["Vigencia"] || "";
  const telefono = campos["Teléfono"] || "";
  const firma = tramite.firma;

  const now = new Date();
  const dia = campos.dia || now.getDate();
  const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
  const anio = campos.anio || now.getFullYear();
  const lugar = campos.lugar || "Torreón";

  let y = 50;

  const agregarFondo = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(fondoImagen, "JPEG", 0, 0, pageWidth, pageHeight);
  };

  const salto = (altura = 5) => {
    if (y + altura > 265) {
      doc.addPage("letter", "portrait");
      agregarFondo();
      y = 60;
    } else {
      y += altura;
    }
  };

  agregarFondo();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SOLICITUD DE LICENCIA DE CONDUCIR", 105, y, { align: "center" });
  salto(10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA Y LUGAR", 15, y);
  doc.setFont("helvetica", "");
  doc.rect(15, y + 2, 180, 8);
  doc.text(`Lugar: ${lugar}    Día: ${dia}    Mes: ${mes}    Año: ${anio}`, 20, y + 8);
  salto(14);

  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL SOLICITANTE", 15, y);
  salto(6);
  doc.setFont("helvetica", "");

  doc.rect(15, y, 180, 8);
  doc.text(`Nombre: ${nombre}`, 17, y + 5);
  salto(9);

  doc.rect(15, y, 180, 8);
  doc.text(`Dirección: ${direccion}`, 17, y + 5);
  salto(9);

  doc.rect(15, y, 90, 8);
  doc.text(`Teléfono: ${telefono}`, 17, y + 5);
  doc.rect(105, y, 90, 8);
  doc.text(`Edad: ${edad}`, 107, y + 5);
  salto(9);

  doc.rect(15, y, 90, 8);
  doc.text(`Tipo de Licencia: ${tipoLicencia}`, 17, y + 5);
  doc.rect(105, y, 90, 8);
  doc.text(`Vigencia: ${vigencia}`, 107, y + 5);
  salto(14);

  doc.setFont("helvetica", "bold");
  doc.text("FIRMA DEL SOLICITANTE", 15, y);
  salto(20);

  if (firma) {
    doc.addImage(firma, "PNG", 20, y, 50, 20);
    salto(25);
  }

  doc.save("Licencia_Conducir.pdf");
}else {
  import("html2pdf.js").then((html2pdf) => {
    const element = document.createElement("div");
    const fechaActual = new Date().toLocaleString();
    const fondoBase64 = fondoImagen;

    const camposHTML = Object.entries(tramite.campos || {})
      .map(([campo, valor]) => `
        <tr>
          <th>${campo}</th>
          <td>${valor || '-'}</td>
        </tr>
      `)
      .join('');

    const firmaHTML = tramite.firma && tramite.firma.startsWith("data:image/")
      ? `
        <div class="page">
          <div class="contenido">
            <div style="text-align: center; margin-top: 140px;">
              <h1 style="margin-bottom: 40px;">Firma del Solicitante</h1>
              <img src="${tramite.firma}" alt="Firma" style="max-width: 400px; max-height: 200px;" />
            </div>
          </div>
        </div>
      `
      : "";

    const htmlContent = `
      <style>
        .page {
          width: 794px;
          height: 1122px;
          font-family: Arial, sans-serif;
          color: #111;
          padding: 130px 40px 40px 40px;
          box-sizing: border-box;
          background-image: url('${fondoBase64}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .contenido {
          position: relative;
          z-index: 1;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }

        th, td {
          padding: 8px;
          border: 1px solid #ccc;
        }

        th {
          background-color: #f0f4f8;
          text-align: left;
        }

        h1, h3 {
          margin: 10px 0;
        }

        .footer {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
          margin-top: 40px;
        }
      </style>

      <div id="pdf-root">
        <div class="page">
          <div class="contenido">
            <div style="text-align: center;">
              <h1>Sistema de Trámites Digitales</h1>
              <p style="font-size: 14px; color:#6b7280;">Documento Validado de Trámite</p>
            </div>

            <hr style="margin: 20px 0;" />

            <h3>Datos del Trámite</h3>
            <table>
              <tr><th>Tipo</th><td>${tramite.tipo}</td></tr>
              <tr><th>Fecha de Solicitud</th><td>${tramite.createdAt ? new Date(tramite.createdAt).toLocaleDateString() : '-'}</td></tr>
              <tr><th>Fecha de Validación</th><td>${tramite.reviewedAt ? new Date(tramite.reviewedAt).toLocaleDateString() : '-'}</td></tr>
              <tr><th>Estado</th><td>${tramite.estado}</td></tr>
            </table>

            <h3>Solicitante</h3>
            <table>
              <tr><th>Nombre</th><td>${tramite.solicitante || '-'}</td></tr>
            </table>

            <h3>Campos adicionales</h3>
            <table>
              ${camposHTML}
            </table>

            <div class="footer">
              Documento generado electrónicamente. No requiere firma física.<br/>
              Generado el: ${fechaActual}
            </div>
          </div>
        </div>

        ${firmaHTML}
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



  // ... aquí puedes seguir con más tipos de trámite usando la misma estructura
};
