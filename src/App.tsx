import { BrowserRouter, Routes, Route } from "react-router-dom";
import SponsorshipManagement from "@/pages/SponsorshipManagement";
import Home from "@/pages/Home";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sponsorship-management" element={<SponsorshipManagement />} />
      </Routes>
    </BrowserRouter>
  );
}