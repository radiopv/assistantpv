import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import AddChild from "@/pages/AddChild";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import DonationDetails from "@/pages/DonationDetails";
import Messages from "@/pages/Messages";
import AdminPermissions from "@/pages/AdminPermissions";
import AdminTranslations from "@/pages/AdminTranslations";
import AdminTravels from "@/pages/AdminTravels";
import AdminStatistics from "@/pages/AdminStatistics";
import AdminFAQ from "@/pages/AdminFAQ";
import AdminActivity from "@/pages/AdminActivity";
import SponsorSpacePage from "@/pages/SponsorSpace";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              
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
              
              <Route path="/donations/add" element={
                <MainLayout>
                  <AddDonation />
                </MainLayout>
              } />
              
              <Route path="/donations/:id" element={
                <MainLayout>
                  <DonationDetails />
                </MainLayout>
              } />
              
              <Route path="/messages" element={
                <MainLayout>
                  <Messages />
                </MainLayout>
              } />
              
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
                  <AdminActivity />
                </MainLayout>
              } />

              <Route path="/sponsor-space" element={
                <MainLayout>
                  <SponsorSpacePage />
                </MainLayout>
              } />
            </Routes>
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;