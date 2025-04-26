import { useNavigate } from 'react-router-dom';

function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Selecciona tu Rol</h1>
      <button className="btn" onClick={() => navigate('/inicio-tramite')}>Usuario</button>
      <button className="btn" onClick={() => navigate('/revisar-tramites')}>Revisor</button>
      <button className="btn" onClick={() => navigate('/admin')}>Administrador</button>
    </div>
  );
}

export default SelectRole;

