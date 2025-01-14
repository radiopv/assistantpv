import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppRoutes } from "@/components/Routes/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;