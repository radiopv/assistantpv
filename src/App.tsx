import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MainLayout from "@/components/Layout/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import AddChild from "@/pages/AddChild";
import Donations from "@/pages/Donations";
import Messages from "@/pages/Messages";
import SponsorSpacePage from "@/pages/SponsorSpace";
import Index from "@/pages/Index";
import AdminPermissions from "@/pages/admin/Permissions";
import AdminTranslations from "@/pages/admin/Translations";
import AdminTravels from "@/pages/admin/Travels";
import AdminStatistics from "@/pages/admin/Statistics";
import AdminFAQ from "@/pages/admin/FAQ";
import ActivityLog from "@/pages/admin/ActivityLog";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              {/* Page d'accueil */}
              <Route path="/" element={<Index />} />
              
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              
              {/* Pages principales */}
              <Route path="/dashboard" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />

              <Route path="/children" element={
                <MainLayout>
                  <Children />
                </MainLayout>
              } />

              <Route path="/children/:id" element={
                <MainLayout>
                  <ChildProfile />
                </MainLayout>
              } />

              <Route path="/children/add" element={
                <MainLayout>
                  <AddChild />
                </MainLayout>
              } />

              <Route path="/donations" element={
                <MainLayout>
                  <Donations />
                </MainLayout>
              } />

              <Route path="/messages" element={
                <MainLayout>
                  <Messages />
                </MainLayout>
              } />

              <Route path="/sponsor-space" element={
                <MainLayout>
                  <SponsorSpacePage />
                </MainLayout>
              } />

              {/* Routes Admin */}
              <Route path="/admin/permissions" element={
                <MainLayout>
                  <AdminPermissions />
                </MainLayout>
              } />

              <Route path="/admin/translations" element={
                <MainLayout>
                  <AdminTranslations />
                </MainLayout>
              } />

              <Route path="/admin/travels" element={
                <MainLayout>
                  <AdminTravels />
                </MainLayout>
              } />

              <Route path="/admin/statistics" element={
                <MainLayout>
                  <AdminStatistics />
                </MainLayout>
              } />

              <Route path="/admin/faq" element={
                <MainLayout>
                  <AdminFAQ />
                </MainLayout>
              } />

              <Route path="/admin/activity" element={
                <MainLayout>
                  <ActivityLog />
                </MainLayout>
              } />

              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;