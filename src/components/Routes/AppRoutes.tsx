import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";
import Home from "@/pages/Home";
import ChildProfile from "@/pages/ChildProfile";
import ChildDetails from "@/pages/ChildDetails";
import Children from "@/pages/Children";
import Dashboard from "@/pages/Dashboard";
import BecomeSponsor from "@/pages/BecomeSponsor";
import Login from "@/pages/auth/Login";
import SponsorDashboard from "@/pages/sponsor/SponsorDashboard";
import SponsorProfile from "@/pages/sponsor/SponsorProfile";
import SponsorAlbum from "@/pages/sponsor/SponsorAlbum";
import Tasks from "@/pages/Tasks";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import AssistantPhotos from "@/pages/AssistantPhotos";
import AssistantSponsorship from "@/pages/AssistantSponsorship";
import MediaManagement from "@/pages/MediaManagement";
import AddChild from "@/pages/AddChild";
import FAQ from "@/pages/admin/FAQ";
import AvailableChildren from "@/pages/public/AvailableChildren";
import PublicDonations from "@/pages/public/PublicDonations";
import NewTestimonial from "@/pages/testimonials/NewTestimonial";
import SponsorshipManagement from "@/pages/admin/SponsorshipManagement";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/available-children" element={<AvailableChildren />} />
        <Route path="/donations" element={<PublicDonations />} />
        <Route path="/child/:id" element={<ChildDetails />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
      </Route>

      {/* Protected routes with MainLayout */}
      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Children Management */}
        <Route path="/children" element={<Children />} />
        <Route path="/children/add" element={<AddChild />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        
        {/* Tasks and Messages */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Donations Management */}
        <Route path="/donations-management" element={<Donations />} />
        <Route path="/donations/add" element={<AddDonation />} />
        
        {/* Assistant Features */}
        <Route path="/assistant/photos" element={<AssistantPhotos />} />
        <Route path="/assistant/sponsorship" element={<AssistantSponsorship />} />
        <Route path="/media-management" element={<MediaManagement />} />
        <Route path="/new-testimonial" element={<NewTestimonial />} />
        
        {/* Sponsor routes */}
        <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
        <Route path="/sponsor-profile" element={<SponsorProfile />} />
        <Route path="/sponsor-album" element={<SponsorAlbum />} />

        {/* Admin routes */}
        <Route path="/admin/sponsorship-management" element={<SponsorshipManagement />} />
      </Route>

      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;