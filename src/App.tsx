import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { MainLayout } from "@/components/Layout/MainLayout";
import { PublicLayout } from "@/components/Layout/PublicLayout";

// Import pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import AddChild from "@/pages/AddChild";
import Donations from "@/pages/Donations";
import PublicDonations from "@/pages/PublicDonations";
import PublicStats from "@/pages/PublicStats";
import PublicVideos from "@/pages/PublicVideos";
import PublicFAQ from "@/pages/PublicFAQ";
import Stories from "@/pages/Stories";
import SponsorDashboard from "@/pages/SponsorDashboard";
import Rewards from "@/pages/Rewards";
import Messages from "@/pages/Messages";
import MediaManagement from "@/pages/MediaManagement";
import SponsorsManagement from "@/pages/SponsorsManagement";
import Settings from "@/pages/Settings";
import UrgentNeeds from "@/pages/UrgentNeeds";
import Permissions from "@/pages/Permissions";
import SponsorshipRequest from "@/pages/SponsorshipRequest";
import PublicAvailableChildren from "@/pages/PublicAvailableChildren";
import PublicSponsoredChildren from "@/pages/PublicSponsoredChildren";
import ChildrenNeeds from "@/pages/ChildrenNeeds";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Interface publique (front-end) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/donations/public" element={<PublicDonations />} />
              <Route path="/statistics" element={<PublicStats />} />
              <Route path="/videos" element={<PublicVideos />} />
              <Route path="/faq" element={<PublicFAQ />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/become-sponsor" element={<SponsorshipRequest />} />
              <Route path="/available-children" element={<PublicAvailableChildren />} />
              <Route path="/sponsored-children" element={<PublicSponsoredChildren />} />
            </Route>

            {/* Interface administrative (back-end) */}
            <Route element={<MainLayout />}>
              {/* Routes Admin */}
              <Route 
                path="/admin/*" 
                element={
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="children" element={<Children />} />
                    <Route path="children/add" element={<AddChild />} />
                    <Route path="children/:id" element={<ChildProfile />} />
                    <Route path="children-needs" element={<ChildrenNeeds />} />
                    <Route path="donations" element={<Donations />} />
                    <Route path="media" element={<MediaManagement />} />
                    <Route path="sponsors" element={<SponsorsManagement />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="permissions" element={<Permissions />} />
                    <Route path="urgent-needs" element={<UrgentNeeds />} />
                    <Route path="messages" element={<Messages />} />
                  </Routes>
                }
              />

              {/* Routes Assistant */}
              <Route 
                path="/assistant/*" 
                element={
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="children" element={<Children />} />
                    <Route path="children/add" element={<AddChild />} />
                    <Route path="children/:id" element={<ChildProfile />} />
                    <Route path="donations" element={<Donations />} />
                    <Route path="media" element={<MediaManagement />} />
                    <Route path="urgent-needs" element={<UrgentNeeds />} />
                    <Route path="messages" element={<Messages />} />
                  </Routes>
                }
              />

              {/* Routes Sponsor */}
              <Route 
                path="/sponsor/*" 
                element={
                  <Routes>
                    <Route path="dashboard" element={<SponsorDashboard />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="rewards" element={<Rewards />} />
                  </Routes>
                }
              />
            </Route>

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;