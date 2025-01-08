import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { PublicLayout } from "@/components/Layout/PublicLayout";

// Public pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import FAQ from "@/pages/public/FAQ";
import AvailableChildren from "@/pages/public/AvailableChildren";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import ChildDetails from "@/pages/ChildDetails";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import AssistantPhotos from "@/pages/AssistantPhotos";
import AssistantSponsorship from "@/pages/AssistantSponsorship";
import MediaManagement from "@/pages/MediaManagement";
import BecomeSponsor from "@/pages/BecomeSponsor";
import SponsorDashboard from "@/pages/SponsorDashboard";
import PublicDonations from "@/pages/public/PublicDonations";
import NewTestimonial from "@/pages/testimonials/NewTestimonial";
import SponsorshipManagement from "@/pages/admin/SponsorshipManagement";

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
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/children/add" element={<AddChild />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        <Route path="/child/:id" element={<ChildDetails />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/donations/add" element={<AddDonation />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/assistant-photos" element={<AssistantPhotos />} />
        <Route path="/assistant-sponsorship" element={<AssistantSponsorship />} />
        <Route path="/media-management" element={<MediaManagement />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
        <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
        <Route path="/testimonials/new" element={<NewTestimonial />} />

        {/* Admin routes */}
        <Route path="/admin/sponsorship-management" element={<SponsorshipManagement />} />
      </Route>

      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;