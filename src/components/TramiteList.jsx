import { useState } from 'react';
import { api } from '../services/api';

function TramiteList() {
  const [tramites, setTramites] = useState(api.getTramites());

  const handleUpdate = (id, status) => {
    api.updateTramite(id, status);
    setTramites(api.getTramites());
  };

  return (
    <div className="flex flex-col gap-4">
      {tramites.length === 0 ? (
        <p>No hay trámites pendientes.</p>
      ) : (
        tramites.map(tramite => (
          <div key={tramite.id} className="border p-4 rounded shadow">
            <p><strong>Nombre:</strong> {tramite.nombre} {tramite.apellido}</p>
            <p><strong>DNI:</strong> {tramite.dni}</p>
            <p><strong>Tipo de trámite:</strong> {tramite.tramiteType}</p>
            <p><strong>Detalles:</strong> {tramite.detalles}</p>
            <p><strong>Status:</strong> {tramite.status}</p>
            {tramite.status === 'Pendiente' && (
              <div className="flex gap-2 mt-2">
                <button className="btn bg-green-500" onClick={() => handleUpdate(tramite.id, 'Aprobado')}>Aprobar</button>
                <button className="btn bg-red-500" onClick={() => handleUpdate(tramite.id, 'Rechazado')}>Rechazar</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TramiteList;

