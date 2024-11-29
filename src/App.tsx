import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/donations/public" element={<PublicDonations />} />
              <Route path="/statistics" element={<PublicStats />} />
              <Route path="/videos" element={<PublicVideos />} />
              <Route path="/faq" element={<PublicFAQ />} />
              <Route path="/stories" element={<Stories />} />
            </Route>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
              <Route path="/children" element={<Children />} />
              <Route path="/children/:id" element={<ChildProfile />} />
              <Route path="/children/add" element={<AddChild />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/rewards" element={<Rewards />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
