import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes"; // 👈 importamos las rutas
import { TramitesProvider } from "./context/TramitesContext";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TramitesProvider>
      <AppRoutes />
      <ToastContainer />
    </TramitesProvider>
  </React.StrictMode>,
);