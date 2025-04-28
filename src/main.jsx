// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes"; // 👈 tus rutas
import { TramitesProvider } from "./context/TramitesContext";
import { DarkModeProvider } from "./context/DarkModeContext"; // 👈 nuevo contexto de dark mode
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider> {/* ⬅️ nuevo envoltorio */}
      <TramitesProvider>
        <AppRoutes />
        <ToastContainer />
      </TramitesProvider>
    </DarkModeProvider>
  </React.StrictMode>,
);