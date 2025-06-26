// src/context/TramitesContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const TramitesContext = createContext();
export const useTramites = () => useContext(TramitesContext);

export const TramitesProvider = ({ children }) => {
  const [tramites, setTramites] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");

  useEffect(() => {
    fetchTramites();
    fetchTiposTramite();
  }, []);

  const fetchTramites = async () => {
    const { data, error } = await supabase
      .from("tramites")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error cargando trámites:", error);
    } else {
      setTramites(data || []);
    }
  };

  const fetchTiposTramite = async () => {
    const { data, error } = await supabase
      .from("tipos_tramite")
      .select("*, areas:area_id (nombre)");

    if (error) {
      console.error("Error al obtener tipos de trámite:", error.message);
      return;
    }

    const tiposConArea = data.map((t) => ({
      ...t,
      area_nombre: t.areas?.nombre || "", // <- importante para mostrar el área
    }));

    setTiposTramite(tiposConArea);
  };

  const buscarUsuarioPorCorreo = async (correo) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("correo", correo)
      .single();

    return { data, error };
  };

  // ✅ AQUÍ: función addTramite corregida
  const addTramite = async (nuevoTramite) => {
    const { data, error } = await supabase
      .from("tramites")
      .insert([nuevoTramite]) // Usa el objeto completo con email, etc.
      .select();

    if (error) {
      console.error("Error creando trámite:", error);
    } else if (data && data.length > 0) {
      setTramites((prev) => [data[0], ...prev]);
    }
  };

  const addTipoTramite = async (tipo) => {
    const { data, error } = await supabase
      .from("tipos_tramite")
      .insert(tipo)
      .select("*, areas:area_id (nombre)");

    if (error) {
      console.error("Error creando tipo de trámite:", error);
    } else if (data && data.length > 0) {
      const tipoConArea = {
        ...data[0],
        area_nombre: data[0].areas?.nombre || "",
      };
      setTiposTramite((prev) => [...prev, tipoConArea]);
    }
  };

  const updateTramiteEstado = async (id, nuevoEstado, comentario = "") => {
    const camposActualizados = {
      estado: nuevoEstado,
      reviewedAt: new Date().toISOString(),
    };

    // Guarda comentario si existe
    if (comentario) {
      camposActualizados.comentario_revisor = comentario;
    }

    const { data, error } = await supabase
      .from("tramites")
      .update(camposActualizados)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error actualizando estado del trámite:", error);
    } else if (data && data.length > 0) {
      setTramites((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data[0] } : t))
      );
    }
  };

  const updateTramiteCampos = async (id, nuevosDatos) => {
    const { data, error } = await supabase
      .from("tramites")
      .update(nuevosDatos)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error actualizando trámite:", error);
    } else if (data && data.length > 0) {
      setTramites((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data[0] } : t))
      );
    }
  };

  const updateTipoTramite = async (id, camposActualizados) => {
    const { nombre, campos, logo_url, area_id } = camposActualizados;

    const { data, error } = await supabase
      .from("tipos_tramite")
      .update({ nombre, campos, logo_url, area_id })
      .eq("id", id)
      .select("*, areas:area_id (nombre)");

    if (error) {
      console.error("Error actualizando tipo de trámite:", error);
    } else if (data && data.length > 0) {
      const actualizadoConArea = {
        ...data[0],
        area_nombre: data[0].areas?.nombre || "",
      };
      setTiposTramite((prev) =>
        prev.map((t) => (t.id === id ? actualizadoConArea : t))
      );
    }
  };

  const deleteTipoTramite = async (id) => {
    const { error } = await supabase
      .from("tipos_tramite")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error eliminando tipo de trámite:", error);
    } else {
      setTiposTramite((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <TramitesContext.Provider
      value={{
        tramites,
        tiposTramite,
        nombreUsuario,
        rolUsuario,
        setNombreUsuario,
        setRolUsuario,
        buscarUsuarioPorCorreo,
        addTramite,
        addTipoTramite,
        updateTramiteEstado,
        updateTramiteCampos,
        updateTipoTramite,
        deleteTipoTramite,
      }}
    >
      {children}
    </TramitesContext.Provider>
  );
};
