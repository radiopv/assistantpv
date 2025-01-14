import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import AddChild from "@/pages/AddChild";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import AssistantPhotos from "@/pages/AssistantPhotos";
import AssistantSponsorship from "@/pages/AssistantSponsorship";
import BecomeSponsor from "@/pages/BecomeSponsor";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/auth/Login";
import MediaManagement from "@/pages/MediaManagement";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import SponsorDashboard from "@/pages/sponsor/SponsorDashboard";
import Tasks from "@/pages/Tasks";
import TranslationsPage from "@/pages/admin/Translations";
import TranslationAdmin from "@/pages/admin/TranslationAdmin";
import { useAuth } from "@/components/Auth/AuthProvider";

export const AppRoutes = () => {
  const { isAssistant } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/children" element={<Children />} />
      <Route path="/children/:id" element={<ChildProfile />} />
      <Route path="/add-child" element={<AddChild />} />
      <Route path="/donations" element={<Donations />} />
      <Route path="/add-donation" element={<AddDonation />} />
      <Route path="/assistant-photos" element={<AssistantPhotos />} />
      <Route path="/assistant-sponsorship" element={<AssistantSponsorship />} />
      <Route path="/become-sponsor" element={<BecomeSponsor />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/media-management" element={<MediaManagement />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/admin/translations" element={<TranslationsPage />} />
      <Route path="/admin/translation-admin" element={<TranslationAdmin />} />
    </Routes>
  );
};