import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TramitesProvider } from './context/TramitesContext';
import './index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TramitesProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </TramitesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);