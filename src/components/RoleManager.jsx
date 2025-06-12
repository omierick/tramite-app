// src/components/RoleManager.jsx

import { useState } from 'react';
import { ALL_SECTIONS, ROLE_PERMISSIONS } from '../roles/permissions';

function RoleManager({ onRoleCreated }) {
    const [nombre, setNombre] = useState('');
    const [secciones, setSecciones] = useState([]);
    const [segmentos, setSegmentos] = useState('');
    const [roles, setRoles] = useState(ROLE_PERMISSIONS);

    const handleCheckbox = (section) => {
        setSecciones(secciones.includes(section)
            ? secciones.filter(s => s !== section)
            : [...secciones, section]
        );
    };

    const handleCreate = () => {
        if (!nombre) return alert('Pon un nombre de rol');
        const nuevo = {
            secciones,
            segmentos: [segmentos]
        };
        setRoles({ ...roles, [nombre]: nuevo });
        setNombre('');
        setSecciones([]);
        setSegmentos('');
        onRoleCreated && onRoleCreated(nombre, nuevo);
    };

    return (
        <div className="p-4 border rounded mb-6">
            <h3 className="text-lg font-bold mb-2">Crear/Editar Rol</h3>
            <input
                className="input"
                type="text"
                placeholder="Nombre del rol"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
            />
            <div className="my-2">
                <span className="font-semibold">Secciones:</span>
                {ALL_SECTIONS.map(sec => (
                    <label key={sec} className="block">
                        <input
                            type="checkbox"
                            checked={secciones.includes(sec)}
                            onChange={() => handleCheckbox(sec)}
                        />
                        {sec}
                    </label>
                ))}
            </div>
            <textarea
                className="input"
                placeholder="Descripción de segmentos"
                value={segmentos}
                onChange={e => setSegmentos(e.target.value)}
            />
            <button className="btn mt-2" onClick={handleCreate}>Guardar Rol</button>
            <div className="mt-4">
                <strong>Roles actuales:</strong>
                <pre className="bg-gray-100 text-xs p-2">{JSON.stringify(roles, null, 2)}</pre>
            </div>
        </div>
    );
}

export default RoleManager;