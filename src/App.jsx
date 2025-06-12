import { TramitesProvider } from "./context/TramitesContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';

const App = () => (
  <DarkModeProvider>
    <TramitesProvider>
      <AppRoutes />
      <ToastContainer />
    </TramitesProvider>
  </DarkModeProvider>
);

export default App;