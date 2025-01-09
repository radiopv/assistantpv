import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Children from "@/pages/Children";
import AvailableChildren from "@/pages/public/AvailableChildren";
import { PhotoValidation } from "@/components/Validation/PhotoValidation";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/children" element={<Children />} />
      <Route path="/available-children" element={<AvailableChildren />} />
      <Route path="/photo-validation" element={<PhotoValidation />} />
      <Route path="/photo-album" element={<PhotoValidation />} />
    </Routes>
  );
};