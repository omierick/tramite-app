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
      .from('tramites')
      .select('*');

    if (error) {
      console.error("Error obteniendo trámites:", error);
    } else {
      setTramites(data);
    }
  };

  const fetchTiposTramite = async () => {
    const { data, error } = await supabase
      .from('tipos_tramite')
      .select('*');

    if (error) {
      console.error("Error obteniendo tipos de trámite:", error);
    } else {
      setTiposTramite(data);
    }
  };

  const addTramite = async (nuevoTramite) => {
    const { data, error } = await supabase
      .from('tramites')
      .insert([{
        tipo: nuevoTramite.tipo,
        campos: nuevoTramite.campos,
        estado: 'Pendiente',
        createdAt: new Date().toISOString(),
        reviewedAt: null
      }]);

    if (error) {
      console.error("Error creando trámite:", error);
    } else {
      setTramites(prev => [...prev, data[0]]);
    }
  };

  const addTipoTramite = async (nuevoTipo) => {
    const { data, error } = await supabase
      .from('tipos_tramite')
      .insert([{
        nombre: nuevoTipo.nombre,
        campos: nuevoTipo.campos
      }]);

    if (error) {
      console.error("Error creando tipo de trámite:", error);
    } else {
      setTiposTramite(prev => [...prev, data[0]]);
    }
  };

  const updateTramiteEstado = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from('tramites')
      .update({
        estado: nuevoEstado,
        reviewedAt: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error("Error actualizando trámite:", error);
    } else {
      fetchTramites();
    }
  };

  return (
    <TramitesContext.Provider value={{
      tramites,
      tiposTramite,
      addTramite,
      addTipoTramite,
      updateTramiteEstado
    }}>
      {children}
    </TramitesContext.Provider>
  );
};