import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import SponsorshipManagement from "@/pages/SponsorshipManagement";
import Donations from "@/pages/Donations";
import Permissions from "@/pages/admin/Permissions";
import Validation from "@/pages/admin/Validation";
import Statistics from "@/pages/admin/Statistics";
import FAQ from "@/pages/admin/FAQ";
import NotFound from "@/pages/NotFound";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/children" element={<Children />} />
                <Route path="/children/add" element={<AddChild />} />
                <Route path="/sponsorship-management" element={<SponsorshipManagement />} />
                <Route path="/donations" element={<Donations />} />
                
                {/* Admin Routes */}
                <Route path="/admin/permissions" element={<Permissions />} />
                <Route path="/admin/validation" element={<Validation />} />
                <Route path="/admin/statistics" element={<Statistics />} />
                <Route path="/admin/faq" element={<FAQ />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;