import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { Toaster } from "sonner";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildPhotos from "@/pages/ChildPhotos";
import SponsorshipManagement from "@/pages/SponsorshipManagement";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import Permissions from "@/pages/admin/Permissions";
import TranslationManager from "@/pages/admin/TranslationManager";
import Validation from "@/pages/admin/Validation";
import Statistics from "@/pages/admin/Statistics";
import EmailManager from "@/pages/admin/EmailManager";
import FAQ from "@/pages/admin/FAQ";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/" element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/children" element={<Children />} />
                <Route path="/children/add" element={<AddChild />} />
                <Route path="/assistant/photos" element={<ChildPhotos />} />
                <Route path="/sponsorship-management" element={<SponsorshipManagement />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/donations/add" element={<AddDonation />} />
                
                {/* Admin Routes */}
                <Route path="/admin/permissions" element={<Permissions />} />
                <Route path="/admin/translations" element={<TranslationManager />} />
                <Route path="/admin/validation" element={<Validation />} />
                <Route path="/admin/statistics" element={<Statistics />} />
                <Route path="/admin/emails" element={<EmailManager />} />
                <Route path="/admin/faq" element={<FAQ />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
