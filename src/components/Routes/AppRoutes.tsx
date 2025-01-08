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
import MediaManagement from "@/pages/MediaManagement";
import AddChild from "@/pages/AddChild";
import FAQ from "@/pages/public/FAQ";
import AvailableChildren from "@/pages/public/AvailableChildren";
import PublicDonations from "@/pages/public/PublicDonations";
import NewTestimonial from "@/pages/testimonials/NewTestimonial";
import SponsorshipManagement from "@/pages/admin/SponsorshipManagement";

// Admin pages
import Validation from "@/pages/admin/Validation";
import Statistics from "@/pages/admin/Statistics";
import Translations from "@/pages/admin/Translations";
import Emails from "@/pages/admin/Emails";
import HomeContentManagement from "@/pages/admin/HomeContentManagement";
import CitiesManagement from "@/pages/admin/CitiesManagement";
import Notifications from "@/pages/admin/Notifications";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/donations-management" element={<Donations />} />
        <Route path="/add-donation" element={<AddDonation />} />
        <Route path="/assistant-photos" element={<AssistantPhotos />} />
        <Route path="/media-management" element={<MediaManagement />} />
        <Route path="/new-testimonial" element={<NewTestimonial />} />
        
        {/* Sponsor routes */}
        <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
        <Route path="/sponsor-profile" element={<SponsorProfile />} />
        <Route path="/sponsor-album" element={<SponsorAlbum />} />

        {/* Admin routes */}
        <Route path="/admin/sponsorship" element={<SponsorshipManagement />} />
        <Route path="/admin/validation" element={<Validation />} />
        <Route path="/admin/statistics" element={<Statistics />} />
        <Route path="/admin/translations" element={<Translations />} />
        <Route path="/admin/emails" element={<Emails />} />
        <Route path="/admin/home-content" element={<HomeContentManagement />} />
        <Route path="/admin/cities" element={<CitiesManagement />} />
        <Route path="/admin/notifications" element={<Notifications />} />
      </Route>

      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};