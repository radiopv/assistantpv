import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Public pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import FAQ from "@/pages/public/FAQ";
import AvailableChildren from "@/pages/public/AvailableChildren";
import BecomeSponsor from "@/pages/BecomeSponsor";
import ChildDetails from "@/pages/ChildDetails";
import Statistics from "@/pages/public/Statistics";
import PublicDonations from "@/pages/public/PublicDonations";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import AssistantPhotos from "@/pages/AssistantPhotos";
import MediaManagement from "@/pages/MediaManagement";
import SponsorDashboard from "@/pages/sponsor/SponsorDashboard";
import NewTestimonial from "@/pages/testimonials/NewTestimonial";
import SponsorshipManagement from "@/pages/admin/SponsorshipManagement";
import Translations from "@/pages/admin/Translations";
import Validation from "@/pages/admin/Validation";
import Emails from "@/pages/admin/Emails";
import AdminFAQ from "@/pages/admin/FAQ";
import CitiesManagement from "@/pages/admin/CitiesManagement";
import Notifications from "@/pages/admin/Notifications";
import LinkChecker from "@/pages/admin/LinkChecker";
import Messages from "@/pages/Messages";
import HomeContentManagement from "@/pages/admin/HomeContentManagement";
import SponsorAlbum from "@/pages/sponsor/SponsorAlbum";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/available-children" element={<AvailableChildren />} />
        <Route path="/public-donations" element={<PublicDonations />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
        <Route path="/child-details/:id" element={<ChildDetails />} />
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/children/add" element={<AddChild />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        <Route path="/sponsor-album" element={<SponsorAlbum />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/donations/add" element={<AddDonation />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/assistant-photos" element={<AssistantPhotos />} />
        <Route path="/media-management" element={<MediaManagement />} />
        
        {/* Sponsor Dashboard Routes */}
        <Route path="/sponsor-dashboard" element={<SponsorDashboard />}>
          <Route path="" element={<SponsorDashboard />} />
          <Route path="gallery" element={<SponsorDashboard />} />
          <Route path="visits" element={<SponsorDashboard />} />
          <Route path="statistics" element={<SponsorDashboard />} />
        </Route>

        <Route path="/testimonials/new" element={<NewTestimonial />} />

        {/* Admin routes */}
        <Route path="/admin/sponsorship-management" element={<SponsorshipManagement />} />
        <Route path="/admin/translations" element={<Translations />} />
        <Route path="/admin/validation" element={<Validation />} />
        <Route path="/admin/emails" element={<Emails />} />
        <Route path="/admin/faq" element={<AdminFAQ />} />
        <Route path="/admin/cities" element={<CitiesManagement />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/link-checker" element={<LinkChecker />} />
        <Route path="/admin/home-content" element={<HomeContentManagement />} />
      </Route>

      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};