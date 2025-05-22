
import { useTramites } from '../context/TramitesContext';
import { sendTramiteEmail } from '../services/emailService';
import { generatePDF } from '../utils/pdfUtils';

function TramiteList() {
  const { tramites, updateTramiteEstado } = useTramites();

  const handleUpdate = async (id, nuevoEstado) => {
    await updateTramiteEstado(id, nuevoEstado);

    const tramite = tramites.find(t => t.id === id);
    if (tramite && tramite.email) {
      await sendTramiteEmail({ ...tramite, estado: nuevoEstado });
    }
  };

  const handleDownload = (tramite) => {
    const tramiteConFechas = {
      ...tramite,
      tipo: tramite.tipo || tramite.tramiteType,
      estado: tramite.estado,
      createdAt: tramite.createdAt || new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
    };
    generatePDF(tramiteConFechas);
  };

  return (
    <div className="flex flex-col gap-4">
      {tramites.length === 0 ? (
        <p>No hay trámites pendientes.</p>
      ) : (
        tramites.map(tramite => (
          <div key={tramite.id} className="border p-4 rounded shadow">
            <p><strong>Nombre:</strong> {tramite.nombre || "-"}</p>
            <p><strong>Tipo de trámite:</strong> {tramite.tipo}</p>
            <p><strong>Detalles:</strong> {JSON.stringify(tramite.campos || {})}</p>
            <p><strong>Estado:</strong> {tramite.estado}</p>

            {tramite.estado === 'Pendiente' && (
              <div className="flex gap-2 mt-2">
                <button
                  className="btn bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdate(tramite.id, 'Aprobado')}
                >
                  Aprobar
                </button>
                <button
                  className="btn bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdate(tramite.id, 'Rechazado')}
                >
                  Rechazar
                </button>
              </div>
            )}

            {tramite.estado === 'Aprobado' && (
              <div className="mt-3">
                <button
                  className="btn bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDownload(tramite)}
                >
                  Descargar PDF
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TramiteList;
