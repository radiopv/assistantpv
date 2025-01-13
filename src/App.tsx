import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "@/components/Routes/AppRoutes";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;