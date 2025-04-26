// src/components/FirmaCanvas.jsx
import { useRef } from 'react';
import SignaturePad from 'react-signature-pad-wrapper';
import "./FirmaCanvas.css"; // (puedes crear uno vacío si quieres mejorar estilos)

const FirmaCanvas = ({ setFirma }) => {
  const signaturePadRef = useRef(null);

  const clear = () => {
    signaturePadRef.current.clear();
  };

  const save = () => {
    if (signaturePadRef.current.isEmpty()) {
      alert("Por favor firma antes de guardar.");
      return;
    }
    const dataUrl = signaturePadRef.current.toDataURL();
    setFirma(dataUrl);
  };

  return (
    <div className="firma-container">
      <SignaturePad
        ref={signaturePadRef}
        options={{
          minWidth: 1,
          maxWidth: 3,
          penColor: 'black',
          backgroundColor: 'white'
        }}
        className="firma-canvas"
      />
      <div className="firma-buttons">
        <button type="button" onClick={clear} className="btn-secondary">Limpiar</button>
        <button type="button" onClick={save} className="btn-primary">Guardar Firma</button>
      </div>
    </div>
  );
};

export default FirmaCanvas;