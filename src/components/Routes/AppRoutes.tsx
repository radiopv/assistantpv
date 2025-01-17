import { Routes, Route } from "react-router-dom";
import Children from "@/pages/Children";
import AddChild from "@/pages/AddChild";
import ChildProfile from "@/pages/ChildProfile";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/children" element={<Children />} />
      <Route path="/children/add" element={<AddChild />} />
      <Route path="/child/:id" element={<ChildProfile />} />
    </Routes>
  );
};