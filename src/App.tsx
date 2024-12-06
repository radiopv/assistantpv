import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import PublicLayout from "./components/Layout/PublicLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Children from "./pages/Children";
import ChildProfile from "./pages/ChildProfile";
import AddChild from "./pages/AddChild";
import Donations from "./pages/Donations";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import BecomeSponsor from "./pages/BecomeSponsor";
import SponsorshipManagement from "./pages/SponsorshipManagement";
import MediaManagement from "./pages/MediaManagement";
import AssistantPhotos from "./pages/AssistantPhotos";
import Login from "./pages/auth/Login";
import FAQ from "./pages/admin/FAQ";
import Statistics from "./pages/admin/Statistics";
import Translations from "./pages/admin/Translations";
import Validation from "./pages/admin/Validation";
import ActivityLog from "./pages/admin/ActivityLog";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/become-sponsor" element={<BecomeSponsor />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/children" element={<Children />} />
        <Route path="/children/:id" element={<ChildProfile />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sponsorship" element={<SponsorshipManagement />} />
        <Route path="/media" element={<MediaManagement />} />
        <Route path="/assistant-photos" element={<AssistantPhotos />} />
        
        {/* Admin Routes */}
        <Route path="/admin/faq" element={<FAQ />} />
        <Route path="/admin/statistics" element={<Statistics />} />
        <Route path="/admin/translations" element={<Translations />} />
        <Route path="/admin/validation" element={<Validation />} />
        <Route path="/admin/activity" element={<ActivityLog />} />
      </Route>
    </Routes>
  );
}

export default App;
