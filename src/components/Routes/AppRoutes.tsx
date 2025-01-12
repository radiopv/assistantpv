import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoadingScreen } from "../LoadingScreen";
import SponsorDashboard from "@/pages/sponsor/SponsorDashboard";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Children = lazy(() => import("@/pages/Children"));
const ChildProfile = lazy(() => import("@/pages/ChildProfile"));
const ChildDetails = lazy(() => import("@/pages/ChildDetails"));
const Donations = lazy(() => import("@/pages/Donations"));
const Messages = lazy(() => import("@/pages/Messages"));
const BecomeSponsor = lazy(() => import("@/pages/BecomeSponsor"));
const SponsorProfile = lazy(() => import("@/pages/sponsor/SponsorProfile"));
const SponsorAlbum = lazy(() => import("@/pages/sponsor/SponsorAlbum"));
const SponsorshipManagement = lazy(() => import("@/pages/SponsorshipManagement"));
const PlannedVisits = lazy(() => import("@/pages/PlannedVisits"));
const Settings = lazy(() => import("@/pages/Settings"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/children" element={<Children />} />
          <Route path="/child/:id" element={<ChildProfile />} />
          <Route path="/children/:id" element={<ChildDetails />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
          <Route path="/sponsor-profile" element={<SponsorProfile />} />
          <Route path="/sponsor-album" element={<SponsorAlbum />} />
          <Route path="/sponsor-album/:childId" element={<SponsorAlbum />} />
          <Route path="/sponsorship-management" element={<SponsorshipManagement />} />
          <Route path="/planned-visits" element={<PlannedVisits />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
