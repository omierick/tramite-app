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
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      console.error("Error cargando tipos de trámite:", error);
    } else {
      setTiposTramite(data || []);
    }
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
      .select();

    if (error) {
      console.error("Error creando tipo de trámite:", error);
    } else if (data && data.length > 0) {
      setTiposTramite((prev) => [...prev, data[0]]);
    }
  };

  
  const updateTramiteEstado = async (id, nuevoEstado) => {
  const { data, error } = await supabase
    .from("tramites")
    .update({
      estado: nuevoEstado,
      reviewedAt: new Date().toISOString(), // 🟢 esto es lo que debe agregarse
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error actualizando estado del trámite:", error);
  } else if (data && data.length > 0) {
    setTramites(prev => prev.map(t => (t.id === id ? { ...t, ...data[0] } : t)));
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
    const { data, error } = await supabase
      .from("tipos_tramite")
      .update(camposActualizados)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error actualizando tipo de trámite:", error);
    } else if (data && data.length > 0) {
      setTiposTramite((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...data[0] } : t))
      );
    }
  };

  const deleteTipoTramite = async (id) => {
    const { error } = await supabase.from("tipos_tramite").delete().eq("id", id);
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