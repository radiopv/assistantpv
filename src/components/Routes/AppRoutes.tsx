import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import Home from "@/pages/Home";
import SponsoredChildren from "@/pages/SponsoredChildren";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/sponsored-children" element={<SponsoredChildren />} />
      </Route>
    </Routes>
  );
};
