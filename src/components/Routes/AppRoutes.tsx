import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About.tsx";
import Contact from "@/pages/Contact.tsx";
import Notifications from "@/pages/Notifications";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
};

export default AppRoutes;