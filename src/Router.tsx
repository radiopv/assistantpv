import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import AddChild from "@/pages/AddChild";
import Donations from "@/pages/Donations";
import Messages from "@/pages/Messages";
import SponsorSpace from "@/pages/SponsorSpace";
import Settings from "@/pages/Settings";
import Permissions from "@/pages/admin/Permissions";
import Translations from "@/pages/admin/Translations";
import Statistics from "@/pages/admin/Statistics";
import FAQ from "@/pages/admin/FAQ";
import ActivityLog from "@/pages/admin/ActivityLog";
import HomeContent from "@/pages/admin/HomeContent";
import Travels from "@/pages/sponsor/Travels";
import { useAuth } from "./components/Auth/AuthProvider";

export const Router = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/sponsor-space" element={<SponsorSpace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin/permissions" element={<Permissions />} />
        <Route path="/admin/translations" element={<Translations />} />
        <Route path="/admin/statistics" element={<Statistics />} />
        <Route path="/admin/faq" element={<FAQ />} />
        <Route path="/admin/activity" element={<ActivityLog />} />
        <Route path="/admin/home-content" element={<HomeContent />} />
        <Route path="/sponsor/travels" element={<Travels />} />
      </Route>
    </Routes>
  );
};