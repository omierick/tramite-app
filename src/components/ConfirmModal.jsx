const ConfirmModal = ({ show, onConfirm, onCancel, mensaje }) => {
    if (!show) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Confirmar acción</h3>
          <p>{mensaje}</p>
          <div className="modal-buttons">
            <button className="btn-cancelar" onClick={onCancel}>Cancelar</button>
            <button className="btn-confirmar" onClick={onConfirm}>Confirmar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmModal;