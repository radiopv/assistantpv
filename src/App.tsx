import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import Donations from "@/pages/Donations";
import Settings from "@/pages/Settings";
import BecomeSponsor from "@/pages/BecomeSponsor";
import AssistantPhotos from "@/pages/AssistantPhotos";
import MediaManagement from "@/pages/MediaManagement";
import SponsorshipManagement from "@/pages/SponsorshipManagement";
import Validation from "@/pages/admin/Validation";
import Statistics from "@/pages/admin/Statistics";
import Translations from "@/pages/admin/Translations";
import Emails from "@/pages/admin/Emails";
import FAQ from "@/pages/admin/FAQ";
import Permissions from "@/pages/admin/Permissions";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/become-sponsor" element={<BecomeSponsor />} />
              </Route>
              
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/children" element={<Children />} />
                <Route path="/children/add" element={<AddChild />} />
                <Route path="/children/:id" element={<ChildProfile />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/donations/add" element={<Donations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/assistant/photos" element={<AssistantPhotos />} />
                <Route path="/media" element={<MediaManagement />} />
                <Route path="/sponsorship" element={<SponsorshipManagement />} />
                
                {/* Admin routes */}
                <Route path="/admin/validation" element={<Validation />} />
                <Route path="/admin/statistics" element={<Statistics />} />
                <Route path="/admin/translations" element={<Translations />} />
                <Route path="/admin/emails" element={<Emails />} />
                <Route path="/admin/faq" element={<FAQ />} />
                <Route path="/admin/permissions" element={<Permissions />} />
              </Route>
            </Routes>
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;