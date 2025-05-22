import jsPDF from "jspdf";

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
  const lugar = campos.lugar || "Torreón";
  const mes = campos.mes || "";
  const anio = campos.anio || "";

  const firma = tramite.firma;

  const nuevaPagina = () => {
    doc.addPage("letter", "portrait");
    doc.setFontSize(12);
    doc.setTextColor(0);
  };

  // Página 1: Formulario principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AUTORIZACIÓN DE LOTIFICACIÓN", 105, 25, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "");
  doc.text(`A  ${lugar}          DE  ${mes}         DE  ${anio}`, 25, 35);

  doc.setFont("helvetica", "bold");
  doc.text("DATOS GENERALES", 15, 45);
  doc.setFont("helvetica", "");
  doc.text(`PROPIETARIO: ${propietario}           TELÉFONO: ${telefonoPropietario}`, 15, 53);
  doc.text(`NOMBRE DEL PDRO.: ${nombrePDRO}     NO. PDRO: ${noPDRO}    TELÉFONO: ${telefonoPDRO}`, 15, 61);
  doc.text(`UBICACIÓN: ${ubicacion}      LOTE: ${lote}      MANZ.: ${manz}     SEC/SMZ: ${secsmz}`, 15, 69);
  doc.text(`DOMICILIO DE NOTIFICACIÓN: ${domicilio}`, 15, 77);

  doc.setFont("helvetica", "bold");
  doc.text("REQUISITOS", 15, 87);
  doc.setFont("helvetica", "");

  const requisitos = [
    "1.- Original y copia de la solicitud de la ventanilla con firmas autógrafas.",
    "2.- 4 planos del proyecto de lotificación con firma autógrafa del propietario y del director responsable de obra, con las características correspondientes.",
    "3.- Factibilidad vigente de servicios expedidos por el sistema municipal de aguas y saneamientos de Torreón, Coahuila, con excepción de predios para vivienda plurifamiliar en fraccionamientos autorizados no municipalizados.",
    "    En caso de que la factibilidad sea expedida por el sistema estatal del aguas y saneamiento (CEAS), este deberá ser ratificado por el sistema de agua de Torreón, Coahuila (SIMAS).",
    "4.- Copia simple del recibo de CFE (electrificación).",
    "5.- Cd con el proyecto de lotificación en programa AutoCAD 2014 Con cuadro de construcción con coordenadas UTM",
    "6.- Plano Topográfico.",
    "7.- Copia de identificación oficial del propietario",
    "8.- Copia de identificación oficial del Perito Director Responsable de Obra"
  ];

  requisitos.forEach((line, i) => {
    doc.text(line, 15, 95 + i * 6);
  });

  doc.setFont("helvetica", "bold");
  doc.text("COSTO DE LA LOTIFICACIÓN CON BASE AL NUMERAL 2 DEL ARTÍCULO 37 DE LA LEY DE INGRESOS 2023", 15, 155);
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

  tipos.forEach((tipo, i) => {
    doc.text(`${tipo[0]}         ${tipo[1]}`, 20, 165 + i * 6);
  });

  doc.setFontSize(10);
  doc.text("EL/LA QUE SUSCRIBE BAJO PROTESTA DE DECIR VERDAD, MANIFIESTO QUE LOS DATOS AQUÍ PROPORCIONADOS, SON VERDADEROS...", 15, 210, { maxWidth: 180 });
  doc.text("NOMBRE Y FIRMA DEL PROPIETARIO", 20, 255);
  doc.text("NOMBRE Y FIRMA DEL PDRO. NO.", 120, 255);

  // Firma imagen si existe
  if (firma) {
    doc.addImage(firma, "PNG", 20, 230, 40, 15);
  }

  // Página 2: Características del plano
  nuevaPagina();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("CARACTERÍSTICAS QUE DEBERÁ TENER UN PLANO\nPROYECTO DE LOTIFICACIÓN", 105, 20, { align: "center" });

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

  caracteristicas.forEach((line, i) => {
    doc.text(line, 15, 30 + i * 6, { maxWidth: 180 });
  });

  // Página 3: Aviso de privacidad
  nuevaPagina();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AVISO DE PRIVACIDAD PARA EL TRÁMITE DE AUTORIZACIÓN DE LOTIFICACIÓN", 105, 20, { align: "center" });

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

  aviso.forEach((line, i) => {
    doc.text(line, 15, 30 + i * 10, { maxWidth: 180 });
  });

  doc.setFont("helvetica", "bold");
  doc.text("NOMBRE Y FIRMA DEL SOLICITANTE", 75, 250);

  if (firma) {
    doc.addImage(firma, "PNG", 20, 235, 40, 15);
  }

  doc.save("Autorizacion_Lotificacion.pdf");
};