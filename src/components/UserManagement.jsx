import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const UserManagement = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({ nombre: "", rol: "", password: "", correo: "" });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });
    const [deleteId, setDeleteId] = useState(null);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("usuarios").select("*");
        if (error) {
            setToast({ message: "Error cargando usuarios: " + error.message, type: "error" });
        } else {
            setUsuarios(data);
        }
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("usuarios").insert([form]);
        if (error) {
            setToast({ message: "Error creando usuario: " + error.message, type: "error" });
        } else {
            setToast({ message: "Usuario creado.", type: "success" });
            setForm({ nombre: "", rol: "", password: "", correo: "" });
            fetchUsuarios();
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        const { error } = await supabase.from("usuarios").delete().eq("id", id);
        if (error) {
            setToast({ message: "Error eliminando usuario: " + error.message, type: "error" });
        } else {
            setToast({ message: "Usuario eliminado.", type: "success" });
            fetchUsuarios();
        }
        setDeleteId(null);
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mt-8">
            {toast.message && (
                <div className={`mb-4 px-4 py-2 rounded ${toast.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {toast.message}
                </div>
            )}
            <h2 className="text-2xl font-bold mb-4">Crear usuario</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4 mb-8">
                <input className="px-3 py-2 border rounded-lg" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                <input className="px-3 py-2 border rounded-lg" placeholder="Rol" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} required />
                <input className="px-3 py-2 border rounded-lg" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <input className="px-3 py-2 border rounded-lg" placeholder="Correo" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50" type="submit" disabled={loading}>Crear usuario</button>
            </form>
            <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
            <table className="min-w-full text-left text-sm font-light">
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Rol</th>
                        <th className="px-4 py-2">Correo</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-4 py-2 text-center text-gray-400">No hay usuarios.</td>
                        </tr>
                    )}
                    {usuarios.map((u) => (
                        <tr key={u.id}>
                            <td className="px-4 py-2">{u.id}</td>
                            <td className="px-4 py-2">{u.nombre}</td>
                            <td className="px-4 py-2">{u.rol}</td>
                            <td className="px-4 py-2">{u.correo}</td>
                            <td className="px-4 py-2">
                                <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                    onClick={() => setDeleteId(u.id)}>
                                    Eliminar
                                </button>
                                {/* Modal de confirmación */}
                                {deleteId === u.id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                                            <h3 className="text-lg font-bold mb-4">¿Eliminar usuario?</h3>
                                            <p className="mb-6">Esta acción no se puede deshacer.</p>
                                            <div className="flex justify-end gap-2">
                                                <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-gray-900"
                                                    onClick={() => setDeleteId(null)}>Cancelar</button>
                                                <button className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 text-white"
                                                    onClick={() => handleDelete(u.id)} disabled={loading}>
                                                    {loading ? "Eliminando..." : "Eliminar"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
