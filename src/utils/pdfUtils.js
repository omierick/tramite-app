import jsPDF from "jspdf";
import fondoImagen from "../assets/UR-003-AUTORIZACIÓN-DE-LOTIFICACIÓN.jpg";

export const generatePDF = (tramite) => {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const campos = tramite.campos || {};

  const propietario = campos["Propietario"] || "";
  const telefonoPropietario = campos["Teléfono"] || "";
  const nombrePDRO = campos["Nombre del PDRO"] || "";
  const noPDRO = campos["Número de PDRO"] || "";
  const telefonoPDRO = campos["Teléfono PDRO"] || "";
  const ubicacion = campos["Ubicación"] || "";
  const lote = campos["Número de Lote"] || "";
  const manz = campos["Manzana"] || "";
  const secsmz = campos["Sección o Super Manzana"] || "";
  const domicilio = campos["Domicilio de Notificación"] || "";
  const now = new Date();
  const dia = campos.dia || now.getDate();
  const mes = campos.mes || now.toLocaleString("es-MX", { month: "long" });
  const anio = campos.anio || now.getFullYear();
  const lugar = campos.lugar || "Torreón";
  const firma = tramite.firma;

  const agregarFondo = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(fondoImagen, "JPEG", 0, 0, pageWidth, pageHeight);
  };

  const nuevaPagina = () => {
    doc.addPage("letter", "portrait");
    doc.setFontSize(12);
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

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AUTORIZACIÓN DE LOTIFICACIÓN", 105, y, { align: "center" });
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
  doc.text(`Teléfono: ${telefonoPropietario}`, 117, y + 5);
  salto(9);

  doc.rect(15, y, 80, 8);
  doc.text(`Nombre PDRO: ${nombrePDRO}`, 17, y + 5);
  doc.rect(95, y, 50, 8);
  doc.text(`No. PDRO: ${noPDRO}`, 97, y + 5);
  doc.rect(145, y, 50, 8);
  doc.text(`Teléfono: ${telefonoPDRO}`, 147, y + 5);
  salto(9);

  doc.rect(15, y, 100, 8);
  doc.text(`Ubicación: ${ubicacion}`, 17, y + 5);
  doc.rect(115, y, 25, 8);
  doc.text(`Lote: ${lote}`, 117, y + 5);
  doc.rect(140, y, 30, 8);
  doc.text(`Manz.: ${manz}`, 142, y + 5);
  doc.rect(170, y, 25, 8);
  doc.text(`Sec/Smz: ${secsmz}`, 172, y + 5);
  salto(9);

  doc.rect(15, y, 180, 8);
  doc.text(`Domicilio de Notificación: ${domicilio}`, 17, y + 5);
  salto(14);

  doc.setFont("helvetica", "bold");
  doc.text("REQUISITOS", 15, y);
  salto(6);
  doc.setFont("helvetica", "");

  const requisitos = [
    "1.- Original y copia de la solicitud de la ventanilla con firmas autógrafas.",
    "2.- 4 planos del proyecto de lotificación con firma autógrafa del propietario y del director responsable de obra, con las características correspondientes.",
    "3.- Factibilidad vigente de servicios expedidos por el sistema municipal de aguas y saneamientos de Torreón, Coahuila, con excepción de predios para vivienda plurifamiliar en fraccionamientos autorizados no municipalizados.",
    "    En caso de que la factibilidad sea expedida por el sistema estatal del aguas y saneamiento (CEAS), este deberá ser ratificado por el sistema de agua de Torreón, Coahuila (SIMAS).",
    "4.- Copia simple del recibo de CFE (electrificación).",
    "5.- CD con el proyecto de lotificación en programa AutoCAD 2014 con cuadro de construcción con coordenadas UTM.",
    "6.- Plano Topográfico.",
    "7.- Copia de identificación oficial del propietario.",
    "8.- Copia de identificación oficial del Perito Director Responsable de Obra."
  ];

  requisitos.forEach((line) => {
    doc.text(line, 15, y);
    salto(5);
  });

  doc.setFont("helvetica", "bold");
  doc.text("COSTO DE LA LOTIFICACIÓN CON BASE AL NUMERAL 2 DEL ARTÍCULO 37 DE LA LEY DE INGRESOS 2023", 15, y);
  salto(6);
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

  doc.setFont("helvetica", "bold");
  doc.rect(20, y, 85, 7);
  doc.text("TIPO DE LOTIFICACIÓN", 22, y + 5);
  doc.rect(105, y, 50, 7);
  doc.text("COSTO POR M2", 107, y + 5);
  salto(7);
  doc.setFont("helvetica", "");

  tipos.forEach((tipo) => {
    doc.rect(20, y, 85, 7);
    doc.text(tipo[0], 22, y + 5);
    doc.rect(105, y, 50, 7);
    doc.text(tipo[1], 107, y + 5);
    salto(7);
  });
salto(5);
  doc.setFontSize(9);
  doc.text("EL/LA QUE SUSCRIBE BAJO PROTESTA DE DECIR VERDAD, MANIFIESTO QUE LOS DATOS AQUÍ PROPORCIONADOS, SON VERDADEROS...", 15, y, { maxWidth: 180 });
  salto(20);

  doc.text("NOMBRE Y FIRMA DEL PROPIETARIO", 20, y);
  doc.text("NOMBRE Y FIRMA DEL PDRO. NO.", 120, y);

  if (firma) {
    doc.addImage(firma, "PNG", 20, y - 20, 40, 15);
  }

  y = nuevaPagina();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("CARACTERÍSTICAS QUE DEBERÁ TENER UN PLANO\nPROYECTO DE LOTIFICACIÓN", 105, y, { align: "center" });
  salto(12);

  doc.setFontSize(10);
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
    doc.text(line, 15, y);
    salto(5);
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

  doc.setFont("helvetica", "bold");
  doc.text("NOMBRE Y FIRMA DEL SOLICITANTE", 75, 250);

  if (firma) {
    doc.addImage(firma, "PNG", 20, 235, 40, 15);
  }

  doc.save("Autorizacion_Lotificacion.pdf");
};
