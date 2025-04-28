// src/components/FirmaCanvas.jsx
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const FirmaCanvas = ({ setFirma }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = canvasRef.current.getContext("2d");
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleGuardarFirma = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    setFirma(dataURL);
    toast.success("¡Firma guardada exitosamente!"); // ✨ Mensaje bonito
  };

  const handleLimpiarCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFirma(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          backgroundColor: "white",
          marginBottom: "10px"
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button className="btn-secondary" type="button" onClick={handleLimpiarCanvas}>
          Limpiar
        </button>
        <button className="btn-primary" type="button" onClick={handleGuardarFirma}>
          Guardar Firma
        </button>
      </div>
    </div>
  );
};

export default FirmaCanvas;