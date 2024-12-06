import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MainLayout from "@/components/Layout/MainLayout";
import PublicLayout from "@/components/Layout/PublicLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";
import Donations from "@/pages/Donations";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import AssistantPhotos from "@/pages/AssistantPhotos";
import FAQ from "@/pages/admin/FAQ";
import Statistics from "@/pages/admin/Statistics";
import Translations from "@/pages/admin/Translations";
import Validation from "@/pages/admin/Validation";
import Emails from "@/pages/admin/Emails";

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
          </Route>
          
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="children" element={<Children />} />
            <Route path="children/add" element={<AddChild />} />
            <Route path="children/:id" element={<ChildProfile />} />
            <Route path="donations" element={<Donations />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="assistant/photos" element={<AssistantPhotos />} />
            <Route path="admin/faq" element={<FAQ />} />
            <Route path="admin/statistics" element={<Statistics />} />
            <Route path="admin/translations" element={<Translations />} />
            <Route path="admin/validation" element={<Validation />} />
            <Route path="admin/emails" element={<Emails />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </LanguageProvider>
  );
};

export default App;