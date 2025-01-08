import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppRoutes from "./components/Routes/AppRoutes";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;