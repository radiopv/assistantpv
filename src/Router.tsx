import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthProvider";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";
import Login from "@/pages/auth/Login";
import Home from "@/pages/Home";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import AddChild from "@/pages/AddChild";
import Dashboard from "@/pages/Dashboard";
import Donations from "@/pages/Donations";
import SponsorSpace from "@/pages/SponsorSpace";
import Settings from "@/pages/Settings";
import Messages from "@/pages/Messages";
import AvailableChildren from "@/pages/AvailableChildren";
import BecomeSponsor from "@/pages/BecomeSponsor";

// Admin pages
import HomeContent from "@/pages/admin/HomeContent";
import HomeModules from "@/pages/admin/HomeModules";
import Permissions from "@/pages/admin/Permissions";
import SponsorshipRequests from "@/pages/admin/SponsorshipRequests";
import Statistics from "@/pages/admin/Statistics";
import Translations from "@/pages/admin/Translations";
import FAQ from "@/pages/admin/FAQ";
import ActivityLog from "@/pages/admin/ActivityLog";

const Router = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/available-children" element={<AvailableChildren />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
      </Route>

      {/* Protected Routes */}
      {user ? (
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/children" element={<Children />} />
          <Route path="/children/:id" element={<ChildProfile />} />
          <Route path="/add-child" element={<AddChild />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/sponsor-space" element={<SponsorSpace />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />

          {/* Admin Routes */}
          {(user.role === 'admin' || user.role === 'assistant') && (
            <>
              <Route path="/admin/home-content" element={<HomeContent />} />
              <Route path="/admin/home-modules" element={<HomeModules />} />
              <Route path="/admin/permissions" element={<Permissions />} />
              <Route path="/admin/sponsorship-requests" element={<SponsorshipRequests />} />
              <Route path="/admin/statistics" element={<Statistics />} />
              <Route path="/admin/translations" element={<Translations />} />
              <Route path="/admin/faq" element={<FAQ />} />
              <Route path="/admin/activity-log" element={<ActivityLog />} />
            </>
          )}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default Router;