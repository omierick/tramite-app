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
      folio = tramite.folio || tramite.id || "No asignado",
    } = campos;

    const firma = tramite.firma;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AUTORIZACIÓN DE LOTIFICACIÓN", 105, y, { align: "center" });
    salto(10);

    // FECHA, LUGAR Y FOLIO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("FOLIO Y FECHA", 15, y);
    doc.setFont("helvetica", "");

    // Dibujar cuadro general dividido en dos
    doc.rect(15, y + 2, 90, 8); // Columna izquierda: Folio
    doc.rect(105, y + 2, 90, 8); // Columna derecha: Fecha y lugar

    // Texto alineado a cada sección
    doc.text(`Folio: ${folio}`, 17, y + 8);
    doc.text(
      `Lugar: ${lugar}  Día: ${dia}  Mes: ${mes}  Año: ${anio}`,
      107,
      y + 8
    );

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
      "3.- Factibilidad vigente de servicios expedidos por el sistema municipal de aguas y saneamientos de Torreón, Coahuila...",
      "4.- Copia simple del recibo de CFE (electrificación).",
      "5.- CD con el proyecto de lotificación en programa AutoCAD 2014 con cuadro de construcción con coordenadas UTM.",
      "6.- Plano Topográfico.",
      "7.- Copia de identificación oficial del propietario.",
      "8.- Copia de identificación oficial del Perito Director Responsable de Obra.",
    ];

    requisitos.forEach((line) => {
      const splitted = doc.splitTextToSize(line, 180);
      if (y + splitted.length * 4.5 > 265) y = nuevaPagina();
      doc.text(splitted, 15, y);
      y += splitted.length * 4.5;
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "COSTO DE LA LOTIFICACIÓN CON BASE AL NUMERAL 2 DEL ARTÍCULO 37 DE LA LEY DE INGRESOS 2023",
      15,
      y
    );
    salto(5);
    doc.setFont("helvetica", "");

    const tipos = [
      ["Popular", "$ 171.00 M2"],
      ["Interés Social", "$ 179.00 M2"],
      ["Interés Medio", "$ 389.00 M2"],
      ["Residencial", "$ 509.00 M2"],
      ["Campestre", "$ 509.00 M2"],
      ["Comercial", "$ 471.00 M2"],
      ["Industrial", "$ 275.00 M2"],
    ];

    doc.setFont("helvetica", "bold");
    const col1X = 20;
    const col2X = 105;
    const rowHeight = 5;

    doc.rect(col1X, y, 85, rowHeight);
    doc.text("TIPO DE LOTIFICACIÓN", col1X + 2, y + 3.5);
    doc.rect(col2X, y, 50, rowHeight);
    doc.text("COSTO POR M2", col2X + 2, y + 3.5);
    salto(rowHeight);

    doc.setFont("helvetica", "");
    tipos.forEach((tipo) => {
      doc.rect(col1X, y, 85, rowHeight);
      doc.text(tipo[0], col1X + 2, y + 3.5);
      doc.rect(col2X, y, 50, rowHeight);
      doc.text(tipo[1], col2X + 2, y + 3.5);
      salto(rowHeight);
    });

    salto(5);
    if (y + 35 > 265) y = nuevaPagina();

    doc.setFontSize(9);
    doc.text(
      "EL/LA QUE SUSCRIBE BAJO PROTESTA DE DECIR VERDAD, MANIFIESTO QUE LOS DATOS AQUÍ PROPORCIONADOS...",
      15,
      y,
      { maxWidth: 180 }
    );
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
    doc.text(
      "CARACTERÍSTICAS QUE DEBERÁ TENER UN PLANO\nPROYECTO DE LOTIFICACIÓN",
      105,
      y,
      { align: "center" }
    );
    salto(12);

    doc.setFontSize(9);
    doc.setFont("helvetica", "");

    const caracteristicas = [
      "1.- LOTIFICACIÓN: INDICAR LA NUMERACIÓN DE CADA MANZANA Y DE CADA UNO DE LOS LOTES...",
      "2.- POLÍGONO DEL TERRENO A FRACCIONAR SEGÚN ESCRITURAS Y/O APEO...",
      "3.- CURVAS Y COTAS DE NIVEL DEL TERRENO CON REFERENCIA AL NIVEL DEL MAR.",
      "4.- SI EL POLÍGONO A FRACCIONAR ES PORCIÓN DE UN TERRENO DE MAYOR EXTENSIÓN...",
      "5.- SI EL TERRENO A FRACCIONAR SE COMPONE DE DOS O MÁS PREDIOS...",
      "6.- TRAZA URBANA CIRCUNDANTE CON SUS RESPECTIVOS ACCESOS AL PREDIO...",
      "7.- EN CASO DE EXISTIR EN EL PREDIO O EN SUS LINDEROS INSTALACIONES DE LA CFE...",
      "8.- SECCIONES TRANSVERSALES DE LAS CALLES TIPO EN LAS QUE EL ARROYO DEBERÁ SER MÚLTIPLO DE...",
      "9.- CROQUIS DE LOCALIZACIÓN CON REFERENCIA Y DISTANCIAS PRECISAS...",
      "10.- CUADRO DE DISTRIBUCIÓN DE ÁREAS CONTENIENDO: ÁREA TOTAL, ÁREA VENDIBLE, ÁREA VIAL Y ÁREA DE DONACIÓN...",
      "11.- NOMBRES PROPUESTOS A LAS CALLES.",
    ];

    caracteristicas.forEach((line) => {
      const splitted = doc.splitTextToSize(line, 180);
      if (y + splitted.length * 4.5 > 265) y = nuevaPagina();
      doc.text(splitted, 15, y);
      y += splitted.length * 4.5;
    });

    y = nuevaPagina();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      "AVISO DE PRIVACIDAD PARA EL TRÁMITE DE AUTORIZACIÓN DE LOTIFICACIÓN",
      105,
      y,
      { align: "center" }
    );
    salto(12);

    doc.setFontSize(10);
    doc.setFont("helvetica", "");

    const aviso = [
      "La Dirección General de Ordenamiento Territorial y Urbanismo del R. Ayuntamiento de Torreón...",
      "La información aquí descrita es en cumplimiento del artículo 21 y 22, de la Ley de Protección de Datos...",
      "Teléfono del Propietario. Ubicación. Domicilio de Notificación. Credencial de Elector.",
      "Los datos personales recabados tienen como finalidad:...",
      "Para Uso y Trámite de Autorización de Lotificación.",
      "Para Actualización de los Sistemas Municipales y Término del Trámite.",
      "Así mismo se informa, que la información relacionada en este trámite de autorización...",
      "Derechos ARCO...",
      "Este Aviso de Privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas...",
    ];

    aviso.forEach((line) => {
      doc.text(line, 15, y, { maxWidth: 180 });
      salto(10);
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const firmaWidth = 40;
    const firmaHeight = 15;
    const firmaX = (pageWidth - firmaWidth) / 2;
    const firmaY = 230;
    const lineaWidth = 60;
    const lineaX = (pageWidth - lineaWidth) / 2;
    const lineaY = 242;

    doc.setLineWidth(0.2);
    doc.line(lineaX, lineaY, lineaX + lineaWidth, lineaY);

    doc.setFont("helvetica", "bold");
    doc.text("NOMBRE Y FIRMA DEL SOLICITANTE", pageWidth / 2, 250, {
      align: "center",
    });

    if (firma) {
      doc.addImage(firma, "PNG", firmaX, firmaY, firmaWidth, firmaHeight);
    }

    doc.save("Autorizacion_Lotificacion.pdf");
  } else {
    import("html2pdf.js").then((html2pdf) => {
      const element = document.createElement("div");
      const fechaActual = new Date().toLocaleString();

      const camposHTML = Object.entries(tramite.campos || {})
        .map(
          ([campo, valor]) => `
        <tr>
          <th>${campo}</th>
          <td>${valor || "-"}</td>
        </tr>
      `
        )
        .join("");

      const firmaHTML =
        tramite.firma && tramite.firma.startsWith("data:image/")
          ? `
        <div class="firma">
          <h2>Firma del Solicitante</h2>
          <img src="${tramite.firma}" alt="Firma" style="max-width: 300px; max-height: 150px;" />
        </div>
      `
          : "";

      // === Validación dinámica de logo ===
      const logoPath =
        tramite.logo_url !== null &&
        tramite.logo_url !== undefined &&
        tramite.logo_url.trim() !== ""
          ? tramite.logo_url
          : new URL("../assets/logo3.png", import.meta.url).href;

      const drawCampo = (x, w, label, valor) => {
        doc.rect(x, y, w, 8);
        doc.text(`${label}: ${valor}`, x + 2, y + 5);
      };

      // Luego la usas
      const titulo =
        tramite.campos?.tituloEmpresa &&
        tramite.campos.tituloEmpresa.trim() !== ""
          ? tramite.campos.tituloEmpresa
          : "Gobierno Omiwave";

      drawCampo(15, 180, "tituloEmpresa", titulo);
      salto(9);

      const htmlContent = `
      <style>
        html, body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          color: #111;
        }

        #pdf-root {
          width: 794px;
          padding: 60px 40px;
          box-sizing: border-box;
        }

        .encabezado {
          text-align: center;
          margin-bottom: 20px;
        }

        .encabezado img {
          height: 80px;
          margin-bottom: 10px;
        }

        .encabezado h1 {
          margin: 0;
          font-size: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          page-break-inside: auto;
        }

        th, td {
          padding: 8px;
          border: 1px solid #ccc;
          vertical-align: top;
        }

        th {
          background-color: #f0f4f8;
          text-align: left;
        }

        h1, h2, h3 {
          margin: 10px 0;
          page-break-after: avoid;
        }

        .firma {
          text-align: center;
          margin-top: 50px;
          page-break-before: auto;
        }

        .footer {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
          margin-top: 60px;
        }

        tr {
          break-inside: avoid;
        }

        @media print {
          body {
            padding-top: 40px;
          }
        }
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
          <tr><th>Fecha de Solicitud</th><td>${
            tramite.createdAt
              ? new Date(tramite.createdAt).toLocaleDateString()
              : "-"
          }</td></tr>
          <tr><th>Fecha de Validación</th><td>${
            tramite.reviewedAt
              ? new Date(tramite.reviewedAt).toLocaleDateString()
              : "-"
          }</td></tr>
          <tr><th>Estado</th><td>${tramite.estado}</td></tr>
        </table>

        <h3>Solicitante</h3>
        <table>
          <tr><th>Nombre</th><td>${tramite.solicitante || "-"}</td></tr>
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
        filename: `tramite_${tramite.tipo.replace(/\s+/g, "_")}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true, // <=== Habilitar CORS
        },
        jsPDF: { unit: "mm", format: "a4" },
      };

      html2pdf.default().from(element).set(opt).save();
    });
  }

  // ... aquí puedes seguir con más tipos de trámite usando la misma estructura
};
