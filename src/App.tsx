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
import HomepageManagement from "@/pages/HomepageManagement";
import TestimonialsManagement from "@/pages/TestimonialsManagement";
import FAQManagement from "@/pages/FAQManagement";
import MyTestimonials from "@/pages/MyTestimonials";
import MyMemories from "@/pages/MyMemories";
import MyCalendar from "@/pages/MyCalendar";
import Share from "@/pages/Share";
import Reports from "@/pages/Reports";
import News from "@/pages/News";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/donations/public" element={<PublicLayout><PublicDonations /></PublicLayout>} />
            <Route path="/statistics" element={<PublicLayout><PublicStats /></PublicLayout>} />
            <Route path="/videos" element={<PublicLayout><PublicVideos /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><PublicFAQ /></PublicLayout>} />
            <Route path="/stories" element={<PublicLayout><Stories /></PublicLayout>} />
            <Route path="/become-sponsor" element={<PublicLayout><SponsorshipRequest /></PublicLayout>} />
            <Route path="/available-children" element={<PublicLayout><PublicAvailableChildren /></PublicLayout>} />
            <Route path="/sponsored-children" element={<PublicLayout><PublicSponsoredChildren /></PublicLayout>} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/sponsor-dashboard" element={<MainLayout><SponsorDashboard /></MainLayout>} />
            <Route path="/children" element={<MainLayout><Children /></MainLayout>} />
            <Route path="/children/:id" element={<MainLayout><ChildProfile /></MainLayout>} />
            <Route path="/children/add" element={<MainLayout><AddChild /></MainLayout>} />
            <Route path="/donations" element={<MainLayout><Donations /></MainLayout>} />
            <Route path="/rewards" element={<MainLayout><Rewards /></MainLayout>} />
            <Route path="/messages" element={<MainLayout><Messages /></MainLayout>} />
            <Route path="/media-management" element={<MainLayout><MediaManagement /></MainLayout>} />
            <Route path="/sponsors-management" element={<MainLayout><SponsorsManagement /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
            <Route path="/urgent-needs" element={<MainLayout><UrgentNeeds /></MainLayout>} />
            <Route path="/permissions" element={<MainLayout><Permissions /></MainLayout>} />
            
            {/* Admin routes */}
            <Route path="/homepage-management" element={<MainLayout><HomepageManagement /></MainLayout>} />
            <Route path="/testimonials-management" element={<MainLayout><TestimonialsManagement /></MainLayout>} />
            <Route path="/faq-management" element={<MainLayout><FAQManagement /></MainLayout>} />
            
            {/* Sponsor routes */}
            <Route path="/my-testimonials" element={<MainLayout><MyTestimonials /></MainLayout>} />
            <Route path="/my-memories" element={<MainLayout><MyMemories /></MainLayout>} />
            <Route path="/my-calendar" element={<MainLayout><MyCalendar /></MainLayout>} />
            <Route path="/share" element={<MainLayout><Share /></MainLayout>} />
            
            {/* Assistant routes */}
            <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
            <Route path="/news" element={<MainLayout><News /></MainLayout>} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;