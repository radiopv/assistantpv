import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/Layout/MainLayout";
import { PublicLayout } from "@/components/Layout/PublicLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import AssistantPhotos from "@/pages/AssistantPhotos";
import ChildPhotos from "@/pages/ChildPhotos";
import Donations from "@/pages/Donations";
import AddDonation from "@/pages/AddDonation";
import SponsorshipManagement from "@/pages/SponsorshipManagement";
import FAQ from "@/pages/admin/FAQ";
import Statistics from "@/pages/admin/Statistics";
import TranslationManager from "@/pages/admin/TranslationManager";
import Validation from "@/pages/admin/Validation";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/children" element={<Children />} />
          <Route path="/children/add" element={<AddChild />} />
          <Route path="/children/:id" element={<ChildProfile />} />
          <Route path="/assistant/photos" element={<AssistantPhotos />} />
          <Route path="/child-photos" element={<ChildPhotos />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/donations/add" element={<AddDonation />} />
          <Route path="/sponsorship-management" element={<SponsorshipManagement />} />
          
          {/* Admin Routes */}
          <Route path="/admin/faq" element={<FAQ />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/admin/translations" element={<TranslationManager />} />
          <Route path="/admin/validation" element={<Validation />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;