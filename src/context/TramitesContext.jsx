import { createContext, useContext, useState, useEffect } from "react";

const TramitesContext = createContext();

export const useTramites = () => useContext(TramitesContext);

export const TramitesProvider = ({ children }) => {
  const [tramites, setTramites] = useState([]);
  const [tiposTramite, setTiposTramite] = useState([]);

  useEffect(() => {
    const storedTramites = localStorage.getItem("tramites");
    const storedTipos = localStorage.getItem("tiposTramite");
    if (storedTramites) setTramites(JSON.parse(storedTramites));
    if (storedTipos) setTiposTramite(JSON.parse(storedTipos));
  }, []);

  const addTramite = (tramite) => {
    const newTramite = {
      ...tramite,
      createdAt: new Date().toISOString(), // Guardamos fecha de creación
      estado: "Pendiente",
    };
    const updated = [...tramites, newTramite];
    setTramites(updated);
    localStorage.setItem("tramites", JSON.stringify(updated));
  };

  const addTipoTramite = (tipo) => {
    const updated = [...tiposTramite, tipo];
    setTiposTramite(updated);
    localStorage.setItem("tiposTramite", JSON.stringify(updated));
  };

  const updateTramiteEstado = (index, nuevoEstado) => {
    const updated = [...tramites];
    updated[index].estado = nuevoEstado;
    updated[index].reviewedAt = new Date().toISOString(); // Guardamos fecha de revisión
    setTramites(updated);
    localStorage.setItem("tramites", JSON.stringify(updated));
  };

  const updateTipoTramite = (id, updatedTipo) => {
    const updated = tiposTramite.map((tipo) =>
      tipo.id === id ? updatedTipo : tipo
    );
    setTiposTramite(updated);
    localStorage.setItem("tiposTramite", JSON.stringify(updated));
  };

  const deleteTipoTramite = (id) => {
    const updated = tiposTramite.filter((tipo) => tipo.id !== id);
    setTiposTramite(updated);
    localStorage.setItem("tiposTramite", JSON.stringify(updated));
  };

  return (
    <TramitesContext.Provider value={{ tramites, tiposTramite, addTramite, addTipoTramite, updateTramiteEstado }}>
      {children}
    </TramitesContext.Provider>
  );
};