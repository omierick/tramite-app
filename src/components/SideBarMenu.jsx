// src/components/SideBarMenu.jsx

import { ROLE_PERMISSIONS } from '../roles/permissions';

// Recibe el rol actual como prop
function SideBarMenu({ rol }) {
    const permisos = ROLE_PERMISSIONS[rol] || {};

    return (
        <aside className="sidebar">
            <h3 className="font-bold mb-2">Secciones</h3>
            <ul className="mb-4">
                {(permisos.secciones || []).map((sec, idx) => (
                    <li key={idx}>{sec}</li>
                ))}
            </ul>
            <h4 className="font-semibold">Segmentos</h4>
            <ul>
                {(permisos.segmentos || []).map((seg, idx) => (
                    <li key={idx}>{seg}</li>
                ))}
            </ul>
        </aside>
    );
}

export default SideBarMenu;