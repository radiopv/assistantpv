import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";
import ChildrenManagement from "@/pages/admin/ChildrenManagement";
import DonationsManagement from "@/pages/admin/DonationsManagement";
import Notifications from "@/pages/Notifications";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import FAQ from "@/pages/public/FAQ";
import AvailableChildren from "@/pages/public/AvailableChildren";
import SponsoredChildren from "@/pages/public/SponsoredChildren";
import BecomeSponsor from "@/pages/BecomeSponsor";
import Statistics from "@/pages/public/Statistics";
import PublicDonations from "@/pages/public/PublicDonations";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import AssistantPhotos from "@/pages/AssistantPhotos";
import MediaManagement from "@/pages/MediaManagement";
import NewTestimonial from "@/pages/testimonials/NewTestimonial";
import SponsorshipManagement from "@/pages/admin/SponsorshipManagement";
import Validation from "@/pages/admin/Validation";
import Emails from "@/pages/admin/Emails";
import AdminFAQ from "@/pages/admin/FAQ";
import CitiesManagement from "@/pages/admin/CitiesManagement";
import LinkChecker from "@/pages/admin/LinkChecker";
import Messages from "@/pages/Messages";
import HomeContentManagement from "@/pages/admin/HomeContentManagement";
import AuditLogs from "@/pages/admin/AuditLogs";
import AllChildren from "@/pages/public/AllChildren";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/children" element={<AllChildren />} />
        <Route path="/public-donations" element={<PublicDonations />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/children/add" element={<AddChild />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/donations/add" element={<AddDonation />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/assistant-photos" element={<AssistantPhotos />} />
        <Route path="/media-management" element={<MediaManagement />} />
        <Route path="/testimonials/new" element={<NewTestimonial />} />

        {/* Admin routes */}
        <Route path="/admin/children-management" element={<ChildrenManagement />} />
        <Route path="/admin/donations-management" element={<DonationsManagement />} />
        <Route path="/admin/validation" element={<Validation />} />
        <Route path="/admin/emails" element={<Emails />} />
        <Route path="/admin/faq" element={<AdminFAQ />} />
        <Route path="/admin/home-content" element={<HomeContentManagement />} />
        <Route path="/admin/sponsorship-management" element={<SponsorshipManagement />} />
        <Route path="/admin/cities-management" element={<CitiesManagement />} />
        <Route path="/admin/link-checker" element={<LinkChecker />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
      </Route>

      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};