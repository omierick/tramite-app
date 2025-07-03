import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const TramitesContext = createContext();

export const useTramites = () => useContext(TramitesContext);

export const TramitesProvider = ({ children }) => {
  const [tramites, setTramites] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [roles, setRoles] = useState([]);
  const [correoUsuario, setCorreoUsuario] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState(null);

  useEffect(() => {
    fetchTramites();
    fetchTiposTramite();
    fetchUsuarios();
    fetchAreas();
    fetchRoles();
  }, []);

  const fetchTramites = async () => {
    const { data, error } = await supabase
      .from("vista_tramites_completa")
      .select("*");

    if (error) {
      console.error("Error al cargar trámites:", error);
    } else {
      setTramites(data);
    }
  };

  const fetchTiposTramite = async () => {
    const { data, error } = await supabase.from("tipos_tramite").select("*");
    if (error) {
      console.error("Error al cargar tipos de trámite:", error);
    } else {
      setTiposTramite(data);
    }
  };

  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from("usuarios").select("*");
    if (error) {
      console.error("Error al cargar usuarios:", error);
    } else {
      setUsuarios(data);
    }
  };

  const fetchAreas = async () => {
    const { data, error } = await supabase.from("areas").select("*");
    if (error) {
      console.error("Error al cargar áreas:", error);
    } else {
      setAreas(data);
    }
  };

  const fetchRoles = async () => {
    const { data, error } = await supabase.from("roles").select("*");
    if (error) {
      console.error("Error al cargar roles:", error);
    } else {
      setRoles(data);
    }
  };

  const value = {
    tramites,
    tiposTramite,
    usuarios,
    areas,
    roles,
    correoUsuario,
    setCorreoUsuario,
    rolUsuario,
    setRolUsuario,
    nombreUsuario,
    setNombreUsuario,
    fetchTramites,
  };

  return (
    <TramitesContext.Provider value={value}>
      {children}
    </TramitesContext.Provider>
  );
};
