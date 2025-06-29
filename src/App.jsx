import { TramitesProvider } from "./context/TramitesContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';

const App = () => (
  <DarkModeProvider>
      <AppRoutes />
      <ToastContainer />
  </DarkModeProvider>
);

export default App;