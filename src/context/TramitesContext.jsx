import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const TramitesContext = createContext();

export const useTramites = () => useContext(TramitesContext);

export const TramitesProvider = ({ children }) => {
  const [tramites, setTramites] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);

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

  const addTramite = async (nuevoTramite) => {
    const { data, error } = await supabase
      .from("tramites")
      .insert({
        ...nuevoTramite,
        createdAt: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error creando trámite:", error);
    } else if (data && data.length > 0) {
      setTramites(prev => [data[0], ...prev]);
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
      setTiposTramite(prev => [...prev, data[0]]);
    }
  };

  const updateTramiteEstado = async (id, nuevoEstado) => {
    const { data, error } = await supabase
      .from("tramites")
      .update({
        estado: nuevoEstado,
        reviewedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error actualizando estado de trámite:", error);
    } else if (data && data.length > 0) {
      setTramites(prev =>
        prev.map(t => (t.id === id ? { ...t, ...data[0] } : t))
      );
    }
  };

  return (
    <TramitesContext.Provider
      value={{
        tramites,
        tiposTramite,
        addTramite,
        addTipoTramite,
        updateTramiteEstado,
      }}
    >
      {children}
    </TramitesContext.Provider>
  );
};