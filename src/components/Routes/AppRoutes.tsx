import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import Sponsorships from "@/pages/Sponsorships";
import SponsorshipRequests from "@/pages/SponsorshipRequests";
import Donations from "@/pages/Donations";
import DonationDetails from "@/pages/DonationDetails";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import AvailableChildren from "@/pages/public/AvailableChildren";
import ChildDetails from "@/pages/ChildDetails";
import ChildrenManagement from "@/pages/admin/ChildrenManagement";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route path="/profile" element={<Profile />} />
      <Route path="/children" element={<Children />} />
      <Route path="/child/:id" element={<ChildProfile />} />
      <Route path="/sponsorships" element={<Sponsorships />} />
      <Route path="/sponsorship-requests" element={<SponsorshipRequests />} />
      <Route path="/donations" element={<Donations />} />
      <Route path="/donation/:id" element={<DonationDetails />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Public routes */}
      <Route path="/available-children" element={<AvailableChildren />} />
      <Route path="/child/:id" element={<ChildDetails />} />
      
      {/* Admin routes */}
      <Route
        path="/admin/children"
        element={
          <ProtectedRoute roles={["admin", "assistant"]}>
            <ChildrenManagement />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};