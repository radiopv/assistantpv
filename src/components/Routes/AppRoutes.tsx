import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/auth/Login";
import Profile from "@/pages/Profile";
import Children from "@/pages/Children";
import ChildProfile from "@/pages/ChildProfile";
import Donations from "@/pages/Donations";
import Messages from "@/pages/Messages";
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/children" element={<Children />} />
      <Route path="/child/:id" element={<ChildProfile />} />
      <Route path="/donations" element={<Donations />} />
      <Route path="/messages" element={<Messages />} />
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