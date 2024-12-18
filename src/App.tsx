import { BrowserRouter, Routes, Route } from "react-router-dom";
import SponsorshipManagement from "@/pages/SponsorshipManagement";
import Home from "@/pages/Home"; // Example of an existing import
import About from "@/pages/About"; // Example of an existing import
import Contact from "@/pages/Contact"; // Example of an existing import

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sponsorship-management" element={<SponsorshipManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
