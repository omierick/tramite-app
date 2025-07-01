import React, { useRef, useState, useEffect } from "react";
import "./CroquisCanvas.css";

const CroquisCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(nativeEvent.offsetX, nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(nativeEvent.offsetX, nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "croquis.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    if (onSave) onSave(image); // Se puede guardar en base64 o enviarlo a un formulario
  };

  return (
    <div className="croquis-container">
      <h3>Dibujar Croquis del Mapa</h3>
      <canvas
        ref={canvasRef}
        className="croquis-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="croquis-buttons">
        <button onClick={handleClear}>Borrar</button>
        <button onClick={handleDownload}>Descargar</button>
        <button onClick={handleSave}>Guardar</button>
      </div>
    </div>
  );
};

export default CroquisCanvas;
