// src/utils/pdfUtils.js
import html2pdf from "html2pdf.js";
import logo from "../assets/image.png"; // Ajusta el path si tu archivo está en otra carpeta
export const generatePDF = (tramite) => {
  const element = document.createElement("div");

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

  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <div style="text-align: center;">
  <div style="
    font-family: Arial, sans-serif;
    color: #333;
    padding: 40px;
    background-image: url('${logo}');
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 600px auto;
  ">
    <!-- Aquí va todo tu contenido HTML -->
  </div>
      <h1 style="color:#1f2937;">${tramite.tipo}</h1>
      <p>PARA SER LLENADO POR LA DEPENDENCIA OFICIAL</p>
    </div>

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

    <h3>DATOS GENERALES</h3>
    <p><strong>PROPIETARIO:</strong> ${tramite.campos?.propietario || '___________________________'} TELÉFONO: ${tramite.campos?.telPropietario || '__________'}</p> <!-- Propietario / Teléfono -->
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

    <p style="margin-top: 30px; font-size:13px;">
      EL/LA QUE SUSCRIBE BAJO PROTESTA DE DECIR VERDAD, MANIFIESTO QUE LOS DATOS AQUÍ PROPORCIONADOS, 
      SON VERDADEROS, EN CASO DE INCURRIR EN FALSEDAD ESTOY CONSCIENTE DE LAS SANCIONES QUE EN EL ÁMBITO CIVÍL, 
      PENAL Y DEL REGLAMENTO DE DESARROLLO URBANO, ZONIFICACIÓN, USO DE SUELO Y C[ONSTRUCCIONES DEL MUNICIPIO DE 
      TORREÓN SE PUEDEN APLICAR POR LA AUTORIDAD COMPETENTE. LEÍ Y FUÍ INFORMADO (A) DE LOS MEDIOS DE REVISIÓN 
      DEL AVISO DE PRIVACIDAD INTEGRAL CORRESPONDIENTE Y ESTOY DE ACUERDO CON OTORGAR MIS DATOS PERSONALES PARA
      SU USO EN CUMPLIMIENTO A LOS ART. 7 Y 16 DE LEY DE PROTECCIÓN DE DATOS PERSONALES EN POSESIÓN DE SUJETOS
      OBLIGADOS DEL ESTADO DE COAHUILA DE ZARAGOZA.
    </p>

    <div style="margin-top: 40px; display: flex; justify-content: space-between;">
      <div style="text-align:center;">
        ___________________________<br/>
        <strong>${tramite.campos?.propietario || 'Nombre del propietario'}</strong> <!-- Firma del propietario -->
      </div>
      <div style="text-align:center;">
        ___________________________<br/>
        <strong>${tramite.campos?.nombrePdro || 'Nombre del PDRO'}</strong> <!-- Firma del PDRO -->
      </div>
    </div>

    
<div class="titulo">
 Características que deberá tener un plano<br>Proyecto de lotificación
 </div>
 <div class="contenido">
 <div class="item"><span class="numero">1.-</span> <span class="texto">Lotificación: Indicar la numeración de cada manzana y de cada uno de los lotes, incluyendo estos sus medidas, superficies y medidas de las áreas de donación (cesión), así como el área prevista para la construcción de vivienda multifamiliar, siendo un 25% para tipo residencial, 30% para tipo medio y 60% para tipo popular y de interés social; además de sus respectivas vialidades de acceso.</span></div>
 <div class="item"><span class="numero">2.-</span> <span class="texto">Polígono: El área a fraccionar según escrituras y/o apeo y deslinde circundando la lotificación, indicando número de las estaciones, rumbos y distancias con coordenadas georreferenciadas (U.T.M.).</span></div>
 <div class="item"><span class="numero">3.-</span> <span class="texto">Curvas y cotas del nivel del terreno con referencia al nivel del mar.</span></div>
 <div class="item"><span class="numero">4.-</span> <span class="texto">Si el polígono a fraccionar es porción de un terreno de mayor extensión, dibujar a escala menor la ubicación, medidas y superficies de cada uno.</span></div>
 <div class="item"><span class="numero">5.-</span> <span class="texto">Si el terreno a fraccionar se compone de dos o más predios que formen un solo cuerpo, indicar a escala menor la ubicación, medida y superficie de cada uno.</span></div>
 <div class="item"><span class="numero">6.-</span> <span class="texto">Traza urbana circundante con sus respectivos accesos al predio que formen un solo cuerpo. Indicar también su ubicación, medidas y superficies de cada uno.</span></div>
 <div class="item"><span class="numero">7.-</span> <span class="texto">En caso de existir en el predio o en sus linderos instalaciones de la Comisión Federal de Electricidad (C.F.E.), líneas de transmisión, distribución municipales, teléfonos, vías férreas o cualquier otro elemento que guarde derecho de vía, se deberán indicar estas afectaciones así como su ancho derivado y el certificado de la dependencia involucrada.</span></div>
 <div class="item"><span class="numero">8.-</span> <span class="texto">Las banquetas deberán ser múltiplo de 3.00 mts. y no menores a 9 mts. Las banquetas menores a 2 mts. A.V. tendrán una sección mínima de 18 mts. (12 mts. de arroyo + 3 mts. de banqueta), lo que indique el lineamiento general de urbanismo.</span></div>
 <div class="item"><span class="numero">9.-</span> <span class="texto">Ubicación y localización con referencia a distancias precisas de algún cruce de vialidades o elementos existentes.</span></div>
 <div class="item"><span class="numero">10.-</span> <span class="texto">Cuadro de distribución de áreas conteniendo: Área total, área vendible, área vial, área de donación, lo que se desee ver.</span></div>
 <div class="item"><span class="numero">11.-</span> <span class="texto">Los habitacionales y cementerios: el 15% del área vendible.</span></div>
 <div class="item"><span class="numero">12.-</span> <span class="texto">Los comerciales e industriales: el 10% del área vendible.</span></div>
 <div class="item"><span class="numero"><br>13.-</span> <span class="texto">Los comerciales: el 5% del área vendible.</span></div>
 </div>

<div class="titulo">
 AVISO DE PRIVACIDAD PARA EL TRÁMITE DE AUTORIZACIÓN DE LOTIFICACIÓN
 </div>
 <div class="contenido">
 <div class="item">La Dirección General de Ordenamiento Territorial y Urbanismo del R. Ayuntamiento de Torreón, con domicilio en ave. Allende no. 333 Poniente, colonia Centro, en la ciudad de Torreón Coahuila, en el 5º Piso del edificio de la Presidencia Municipal quien es la responsable del uso y protección de datos personales presentados en este Trámite, y para lo cual se informa lo siguiente:</div>
 <div class="item">La información aquí descrita es en cumplimiento del artículo 21 Y 22, de la Ley de Protección de Datos Personales En Posesión de Sujetos Obligados del Estado de Coahuila de Zaragoza, para llevar a cabo las finalidades descritas en el presente Aviso de Privacidad, para dar cumplimiento al trámite, servicio, programa o proyecto, se le requiere como datos personales los siguientes:</div>
 <div class="item">
 <div class="subtitulo">Teléfono del Propietario. Ubicación.</div>
 <div class="subtitulo">Domicilio de Notificación. Credencial de Elector.</div>
 </div>
 <div class="item">Los datos personales recabados tienen como finalidad:</div>
 <div class="item">Para Uso y Trámite de Autorización de Lotificación.</div>
 <div class="item">Para Actualización de los Sistemas Municipales y Termino del Trámite</div>
 <div class="item">Así mismo se informa, que la información relacionada en este trámite de autorización de lotificación, es susceptible a ser difundida públicamente de acuerdo a la Ley de Acceso, siempre y cuando el titular de los datos personales lo haya consentido por escrito y/o cuando por algún ordenamiento jurídico se requiera.</div>
 <div class="item">
 <div class="subtitulo">Derechos ARCO</div>
 <div class="item">El titular tiene derecho a conocer cuáles Datos Personales se tienen de él, para qué se utilizan y las condiciones de uso que se les da (acceso); así mismo, es su derecho solicitar la corrección de su información en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que puede ser eliminada de registro cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (oposición).</div>
 <div class="item">En caso de que el titular no desee que sus datos personales sean tratados o transferidos para el fin mencionado, lo puede presentar desde este momento por escrito a la Unidad de Transparencia Municipal, llenado la Solicitud de Acceso, Rectificación, Cancelación u Oposición respecto a los datos personales, misma que podrá obtener en la Unidad o Módulo de Transparencia, con los Enlaces de Transparencia de las Distintas Dependencias Municipales o descargarla por internet en el sitio de Transparencia en la sección de Protección de Datos Personales.</div>
 <div class="item"><br><br><br><br>El procedimiento para ejercer cualquiera de los Derechos de Acceso, Rectificación, Cancelación y/o Oposición, el titular deberá presentar la solicitud respectiva por escrito en las entidades mencionadas en el párrafo anterior en horario de 8:00 a 15:00 hrs. de lunes a viernes, o enviar solicitud debidamente llenada y con copia de Identificación al email de la Unidad de Transparencia Municipal unidaddetransparenciatorreon@gmail.com, la descripción completa de este procedimiento lo podrá encontrar disponible físicamente en las Dependencias Municipales y electrónicamente en el sitio de Protección de Datos Personales mencionado.</div>
 </div>
 <div class="item">El presente Aviso de Privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales de las propias políticas del Gobierno Municipal. Nos comprometemos a mantener informado al titular sobre los cambios que pueda sufrir el presente Aviso de Privacidad, a través de notificación por medios electrónicos o por escrito a los titulares.</div>

    
    <p style="margin-top:30px; font-size:11px; color: #6b7280;">
      Nota: Para obtener el costo total del trámite se debe incluir el 1% de aportación a bomberos y $3.00 por concepto de aprovechamientos.
    </p>

    <p style="margin-top:40px; font-size:12px; color:#6b7280; text-align:center;">
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