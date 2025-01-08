import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import AssistantPhotos from "@/pages/AssistantPhotos";
import MediaManagement from "@/pages/MediaManagement";
import BecomeSponsor from "@/pages/BecomeSponsor";
import AvailableChildren from "@/pages/public/AvailableChildren";
import CitiesManagement from "@/pages/admin/CitiesManagement";
import Tasks from "@/pages/Tasks";

// Admin pages
import Statistics from "@/pages/admin/Statistics";
import Validation from "@/pages/admin/Validation";
import Translations from "@/pages/admin/Translations";
import Emails from "@/pages/admin/Emails";
import FAQ from "@/pages/admin/FAQ";
import SponsorshipManagement from "@/pages/admin/SponsorshipManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
        <Route path="/become-sponsor/:childId" element={<BecomeSponsor />} />
        <Route path="/available-children" element={<AvailableChildren />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/children/add" element={<AddChild />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/donations/add" element={<AddDonation />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/assistant/photos" element={<AssistantPhotos />} />
        <Route path="/media" element={<MediaManagement />} />
        <Route path="/tasks" element={<Tasks />} />
        
        {/* Admin routes */}
        <Route path="/admin/statistics" element={<Statistics />} />
        <Route path="/admin/validation" element={<Validation />} />
        <Route path="/admin/translations" element={<Translations />} />
        <Route path="/admin/emails" element={<Emails />} />
        <Route path="/admin/faq" element={<FAQ />} />
        <Route path="/admin/sponsorships" element={<SponsorshipManagement />} />
        <Route path="/admin/cities" element={<CitiesManagement />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;